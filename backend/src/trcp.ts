import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";

const trpc = initTRPC.context<Context>().create();
export const middleware = trpc.middleware;
export const router = trpc.router;

const isAuthed = middleware(({ next, ctx }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const publicProcedure = trpc.procedure;
export const protectedProcedure = trpc.procedure.use(isAuthed);
