import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import path from "path";
import { appRouter } from "./src/router";
import { createContext } from "./src/context";
import { productionMode } from "./src/env";

const __rootdir = path.dirname(__dirname);

const server = Fastify({
  logger: true,
});

server.register(fastifyTRPCPlugin, {
  prefix: "/api",
  trpcOptions: { router: appRouter, createContext },
});

if (productionMode) {
  server.log.info("Setting up for production");
  server.register(fastifyStatic, {
    root: path.join(__rootdir, "frontend/dist"),
  });
  server.setNotFoundHandler((_, res) => {
    res.sendFile("index.html");
  });
} else {
  server.register(require("@fastify/cors"), {
    origin: "http://127.0.0.1:5173",
    methods: ["OPTIONS", "GET", "POST"],
    credentials: true,
  });
}

// Run the server!
server.listen({ port: 3000 }, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Server is now listening on ${address}`);
});

// for use in client/frontend modules
export type AppRouter = typeof appRouter;
