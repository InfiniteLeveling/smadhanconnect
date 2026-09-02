import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma = global.prismaGlobal || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
});

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully via Prisma');
  } catch (err) {
    console.warn('⚠️ Database connection deferred/offline mode:', (err as Error).message);
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};
