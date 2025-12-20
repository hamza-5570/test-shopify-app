import { PrismaClient } from "@prisma/client";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient();
  }
}

const prisma = global.prismaGlobal ?? new PrismaClient();

export default prisma;
