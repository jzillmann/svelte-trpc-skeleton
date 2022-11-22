import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { type inferAsyncReturnType, TRPCError } from "@trpc/server";
import type { FastifyReply, FastifyRequest } from "fastify";
import cookie, { type CookieSerializeOptions } from "cookie";
import { getSession } from "./sessions";

export const SESSION_ID = "session";

export function createContext({ req, res }: CreateFastifyContextOptions) {
  const cookies = cookieFunctions(req, res);
  const sessionId = cookies.get(SESSION_ID);
  const session = getSession(sessionId);

  return {
    session,
    sessionId,
    requestHeaders: req.headers,
    cookies: cookieFunctions(req, res),
    ...sendFunctions,
  };
}

const sendFunctions = {
  sendBadRequest: (message: string) => {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message,
    });
  },
};

function cookieFunctions(req: FastifyRequest, res: FastifyReply) {
  const cookieHeader = req.raw.headers.cookie || "";
  const cookies = cookie.parse(cookieHeader);

  const set = (
    name: string,
    value: string,
    options?: CookieSerializeOptions
  ) => {
    const serialized = cookie.serialize(name, value, options);
    res.header("Set-Cookie", serialized);
  };

  return {
    get: (name: string) => {
      return cookies[name];
    },
    set,
    setSessionCookie: (value: string, options: CookieSerializeOptions) =>
      set(SESSION_ID, value, options),
    removeSessionCookie: () =>
      set(SESSION_ID, "", { path: "/", expires: new Date(0) }),
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
