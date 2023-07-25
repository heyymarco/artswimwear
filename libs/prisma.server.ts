// ORMs:
import {
    PrismaClient,
}                           from '@prisma/client'



let prisma: PrismaClient
declare global {
    var prisma: PrismaClient|undefined
}



console.log('NODE_ENV: ', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
    prisma.$connect()
    .then(() => {
        console.log('connected to mongoDB!');
    })
    .catch(() => {
        console.log('FAILED to connect mongoDB!');
    });
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient()
        global.prisma.$connect()
    }
    prisma = global.prisma;
}

export { prisma }
