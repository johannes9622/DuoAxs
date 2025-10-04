import { router, authedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "@duoaxs/db";
import QRCode from "qrcode";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export const bookingRouter = router({
  create: authedProcedure
    .input(z.object({
      proUserId: z.string(),
      gymId: z.string().nullable(),
      category: z.enum(["TRAINER","NUTRITION_COACH","CHEF"]),
      sessionType: z.enum(["IN_GYM","VIRTUAL","IN_PERSON"]),
      scheduledFor: z.string(),
      durationMin: z.number().min(15),
      priceCents: z.number().min(500),
    }))
    .mutation(async ({ input, ctx }) => {
      const clientId = ctx.user.id;
      const pro = await prisma.user.findUnique({ where: { id: input.proUserId }, include: { proProfile: true } });
      if (!pro?.proProfile) throw new Error("Pro not found");

      const booking = await prisma.booking.create({
        data: {
          clientId,
          proId: pro.id,
          gymId: input.gymId ?? undefined,
          category: input.category,
          sessionType: input.sessionType,
          scheduledFor: new Date(input.scheduledFor),
          durationMin: input.durationMin,
          priceCents: input.priceCents,
        },
      });

      const bookingFee = Math.round(input.priceCents * 0.10);
      const amount = input.priceCents + bookingFee;

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: { bookingId: booking.id },
      });

      const [clientQr, proQr] = await Promise.all([
        QRCode.toDataURL(JSON.stringify({ role: "client", bookingId: booking.id })),
        QRCode.toDataURL(JSON.stringify({ role: "pro", bookingId: booking.id })),
      ]);
      const passcode = Math.random().toString().slice(2, 8);

      await prisma.booking.update({
        where: { id: booking.id },
        data: { stripePaymentIntentId: paymentIntent.id, clientQr, proQr, passcode, status: "CONFIRMED" },
      });

      return { bookingId: booking.id, clientSecret: paymentIntent.client_secret, clientQr, proQr, passcode };
    }),

  start: authedProcedure
    .input(z.object({ bookingId: z.string(), proof: z.string().optional() }))
    .mutation(async ({ input }) => {
      return prisma.booking.update({ where: { id: input.bookingId }, data: { status: "IN_PROGRESS" } });
    }),

  completeAndPayout: authedProcedure
    .input(z.object({ bookingId: z.string() }))
    .mutation(async ({ input }) => {
      const b = await prisma.booking.findUnique({
        where: { id: input.bookingId },
        include: { gym: true, pro: { include: { proProfile: true } }, client: true },
      });
      if (!b?.pro?.proProfile) throw new Error("Booking not found");

      const proAccount = b.pro.proProfile.stripeAccountId || undefined;
      const gymAccount = b.gym?.stripeAccountId || undefined;

      const base = b.priceCents;
      const bookingFee = Math.round(base * 0.10);
      const platformCut = Math.round(base * 0.18);

      const proNet = base - platformCut;
      const halfFee = Math.floor(bookingFee / 2);
      const halfPlatform = Math.floor(platformCut / 2);
      const gymShare = gymAccount ? (halfFee + halfPlatform) : 0;
      const duoaxsShare = (bookingFee - halfFee) + (platformCut - halfPlatform);

      // Transfers for Pro and Gym (platform share remains in platform balance)
      if (proAccount && proNet > 0) {
        await stripe.transfers.create({ amount: proNet, currency: "usd", destination: proAccount, metadata: { bookingId: b.id, role: "pro" } });
      }
      if (gymAccount && gymShare > 0) {
        await stripe.transfers.create({ amount: gymShare, currency: "usd", destination: gymAccount, metadata: { bookingId: b.id, role: "gym" } });
      }

      await prisma.booking.update({ where: { id: b.id }, data: { status: "COMPLETED" } });
      return { status: "COMPLETED", proNet, gymShare, duoaxsShare };
    }),
});
