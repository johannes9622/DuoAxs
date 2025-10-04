import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "@duoaxs/db";

export const discoveryRouter = router({
  searchPros: publicProcedure
    .input(z.object({
      category: z.enum(["TRAINER","NUTRITION_COACH","CHEF"]).optional(),
      nearGymId: z.string().optional(),
      instantOnly: z.boolean().optional(),
      query: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const where: any = {};
      if (input?.category) where.categories = { has: input.category };
      if (input?.instantOnly) where.isLive = true;
      if (input?.nearGymId) where.facilities = { array_contains: input.nearGymId };
      return prisma.proProfile.findMany({ where, take: 50, include: { user: true } });
    }),
});
