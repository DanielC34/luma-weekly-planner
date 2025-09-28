// lib/prisma.ts
import { PrismaClient } from "../app/generated/prisma";

declare global {
  // Allows global prisma client in development to avoid hot reload issues
  var prisma: PrismaClient | undefined;
}

// Use existing PrismaClient if already created (dev), otherwise create new
export const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
