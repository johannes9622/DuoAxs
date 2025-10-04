import { router, authedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "@duoaxs/db";

export const liveRouter = router({
  toggle: authedProcedure
    .input(z.object({ isLive: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      return prisma.proProfile.update({ where: { userId: ctx.user.id }, data: { isLive: input.isLive, liveUpdatedAt: new Date() } });
    }),
});
