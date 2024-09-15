import {PrismaClient} from '@prisma/client'
import {hashSync} from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    // Seed Users
    const user1 = await prisma.user.create({
        data: {
            name: 'rafi',
            email: 'rafi@gmail.com',
            password: hashSync('rafi', 10),
            role: 'ADMIN',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: 'hasib',
            email: 'hasib@gmail.com',
            password: hashSync('hasib', 10),
            role: 'USER',
        },
    });

    const user3 = await prisma.user.create({
        data: {
            name: 'wadud',
            email: 'wadud@gmail.com',
            password: hashSync('wadud', 10),
            role: 'USER',
        },
    });

    console.log({user1, user2, user3});

    // Seed Products
    const products = Array.from({length: 20}, (_, i) => ({
        name: `Product ${i + 1}`,
        description: `This is a description for product ${i + 1}`,
        price: (Math.random() * 100).toFixed(2),
        tags: `tag${i + 1}, tag${20 - 1}`,
    }));

    const createdProducts = await prisma.product.createMany({
        data: products,
    });

    console.log(`Seeded ${createdProducts.count} products`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
