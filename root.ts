import { router } from "./trpc";
import { discoveryRouter } from "./routers/discovery";
import { bookingRouter } from "./routers/booking";
import { liveRouter } from "./routers/live";

export const appRouter = router({ discovery: discoveryRouter, booking: bookingRouter, live: liveRouter });
export type AppRouter = typeof appRouter;
