import slugify from "slugify";

import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();


async function main() {
    const tags = [
        "Politique",
        "Économie",
        "Sports",
        "Technologie",
        "Santé",
        "Divertissement",
        "Monde",
        "Local",
        "Opinion",
        "Actualité",
    ];

    for (const name of tags) {
        const slug = slugify(name, { lower: true, strict: true });

        await prisma.tag.upsert({
            where: { slug },
            update: {},
            create: {
                name,
                slug,
            },
        });

        console.log(`Seeded tag: ${name}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });