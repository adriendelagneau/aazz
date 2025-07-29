import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
const categories = [
  { name: "Monde", slug: "monde" },
  { name: "Politique", slug: "politique" },
  { name: "Affaires & Finance", slug: "affaires-finance" },
  { name: "Technologie", slug: "technologie" },
  { name: "Science & Santé", slug: "science-sante" },
  { name: "Environnement", slug: "environnement" },
  { name: "Éducation", slug: "education" },
  { name: "Opinion", slug: "opinion" },
  { name: "Mode de vie", slug: "mode-de-vie" },
  { name: "Voyages", slug: "voyages" },
  { name: "Gastronomie", slug: "gastronomie" },
  { name: "Culture", slug: "culture" },
  { name: "Divertissement", slug: "divertissement" },
  { name: "Sports", slug: "sports" },
  { name: "Transports", slug: "transports" },
  { name: "Énergie", slug: "energie" }
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
