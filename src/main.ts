import http from "http";
import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const server = http.createServer(app);

server.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});

const shutdown = (signal: NodeJS.Signals) => {
  console.log(`${signal} qabul qilindi. Server to'xtatilmoqda...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log("Server to'xtatildi.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
