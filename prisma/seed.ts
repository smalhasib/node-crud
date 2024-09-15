import {PrismaClient} from '@prisma/client'
import {hashSync} from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    // Seed Users
    const user1 = await prisma.user.create({
        data: {
            name: 'rafi',
            email: 'rafi@gmail.com',
            password: hashSync('rafi12', 10),
            role: 'ADMIN',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: 'hasib',
            email: 'hasib@gmail.com',
            password: hashSync('hasib1', 10),
            role: 'USER',
        },
    });

    const user3 = await prisma.user.create({
        data: {
            name: 'wadud',
            email: 'wadud@gmail.com',
            password: hashSync('wadud1', 10),
            role: 'USER',
        },
    });

    // Seed Addresses for the users
    const address1 = await prisma.address.create({
        data: {
            lineOne: '123 Admin Street',
            lineTwo: 'Apt 101',
            city: 'Admin City',
            country: 'Adminland',
            pincode: 12345,
            userId: user1.id, // Associate address with user1
        },
    });

    const address2 = await prisma.address.create({
        data: {
            lineOne: '456 User Avenue',
            lineTwo: null, // Optional field
            city: 'User City',
            country: 'Userland',
            pincode: 67890,
            userId: user2.id, // Associate address with user2
        },
    });

    const address3 = await prisma.address.create({
        data: {
            lineOne: '789 Main Road',
            lineTwo: 'Suite 202',
            city: 'Wadud Town',
            country: 'Wadudland',
            pincode: 11223,
            userId: user3.id, // Associate address with user3
        },
    });

    console.log({user1, user2, user3, address1, address2, address3});

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
