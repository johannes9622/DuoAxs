import { initTRPC } from "@trpc/server";
import superjson from "superjson";

export const t = initTRPC.create({ transformer: superjson });
export const router = t.router;
export const publicProcedure = t.procedure;
export const authedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx?.user) throw new Error("UNAUTHORIZED");
  return next({ ctx: { user: ctx.user } });
});
