import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./trcp";
import { authRouter } from "./routes/auth";

export const appRouter = router({
  auth: authRouter,
  greeting: publicProcedure.output(z.string()).query(({ ctx }) => {
    return "hello tRPC v10!" + ctx.session?.username;
  }),
  greetingSecure: protectedProcedure.query(
    ({ ctx }) => `huhu ${ctx.session.username}`
  ),
});
