import { protectedProcedure, publicProcedure, router } from "../trcp";
import { z } from "zod";
import crypto from "crypto";
import { registerSession, removeSession } from "../sessions";
import { productionMode } from "../env";
import type { CookieSerializeOptions } from "cookie";
import type { IncomingHttpHeaders } from "http";

const hoursInSeconds = (hours: number) => 60 * 60 * hours;

const defaultSessionCookieOptions: CookieSerializeOptions = {
  path: "/",
  httpOnly: true,
  maxAge: hoursInSeconds(4),
  sameSite: productionMode ? "strict" : "none",
  secure: true,
};

/**
 * Safari needs cookie's 'secure' to be false locally (dev+prod).
 * For chrome it needs to be true (dev+prod).
 *
 * @param headers
 * @returns
 */
const needsUnsecureCookie = (headers: IncomingHttpHeaders) => {
  const isOnLocalhost =
    headers.host?.startsWith("127.0.0.1") ||
    headers.host?.startsWith("localhost");
  if (!isOnLocalhost) {
    return false;
  }
  const userAgent = headers["user-agent"] || "";
  const isSafari =
    userAgent.includes("Safari") && !userAgent.includes("Chrome");
  if (!isSafari) {
    return false;
  }
  return true;
};

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    // TODO output userInfo ?
    .mutation(({ input, ctx }) => {
      if (ctx.session) {
        return ctx.sendBadRequest("Already logged in");
      }
      const { username, password } = input;
      const loginSucceeded = username === "demo" && password === "***";
      if (!loginSucceeded) {
        return ctx.sendBadRequest("Invalid user or password");
      }

      const sessionId = crypto.randomUUID();
      let sessionCookieOptions = defaultSessionCookieOptions;
      if (needsUnsecureCookie(ctx.requestHeaders)) {
        sessionCookieOptions = {
          ...defaultSessionCookieOptions,
          secure: false,
        };
      }
      ctx.cookies.setSessionCookie(sessionId, sessionCookieOptions);
      registerSession(sessionId, username);
    }),
  logout: protectedProcedure.query(({ ctx }) => {
    removeSession(ctx.sessionId);
    ctx.cookies.removeSessionCookie();
  }),
});
