import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

async function main() {
    const prisma = new PrismaClient();

    //Delete All Tables in DB
    await prisma.user.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.product.deleteMany();

    //Seed Sample Products
    await prisma.product.createMany({
        data: sampleData.products,
    })

    //Seed Sample Users
    await prisma.user.createMany({
        data: sampleData.users,
    })

    console.log("Seeded data");
}

main();