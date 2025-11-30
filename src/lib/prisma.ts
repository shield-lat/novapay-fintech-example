import { PrismaClient } from '@prisma/client';

// Evitar múltiples instancias en desarrollo (Hot Reload)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'], // Solo loguear errores para menos ruido
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
