import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
const categories = [
    { name: "World", slug: "world" },
    { name: "Politics", slug: "politics" },
    { name: "Business & Finance", slug: "business-finance" },
    { name: "Technology", slug: "technology" },
    { name: "Science & Health", slug: "science-health" },
    { name: "Environment", slug: "environment" },
    { name: "Education", slug: "education" },
    { name: "Opinion", slug: "opinion" },
    { name: "Lifestyle", slug: "lifestyle" },
    { name: "Travel", slug: "travel" },
    { name: "Food & Drink", slug: "food-drink" },
    { name: "Culture", slug: "culture" },
    { name: "Entertainment", slug: "entertainment" }, // covers Music, Art, etc.
    { name: "Sports", slug: "sports" },
    { name: "Real Estate", slug: "real-estate" },
    { name: "Automotive", slug: "automotive" }
];

    for (const category of categories) {
        // Upsert to avoid duplicates on rerun
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        });
    }

    console.log("Categories seeded ✅");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
