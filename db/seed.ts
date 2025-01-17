import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";
import { hash } from "@/lib/encrypt";

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

    const users = []

    for(let i =0; i < sampleData.users.length; i++){
        users.push({
            ...sampleData.users[i],
            password: await hash(sampleData.users[i].password)
        })
    }

    //Seed Sample Users
    await prisma.user.createMany({
        data: users,
    })

    console.log("Seeded data");
}

main();