import { PrismaClient } from '@prisma/client';

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
  
  // This allows us to use `prisma` directly in our code
  const prisma: PrismaClient;
}

export {};  // This file needs to be a module
