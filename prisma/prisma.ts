import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

// async function main() {
//     const user = prisma.user.create({ data: { email: "rammsteinam@gmail.com", name: "RammsteinAM", password: "Aaaa1234" } });
// }

// main()
//     .catch(e => {
//         throw e
//     })
//     .finally(async () => {
//         await prisma.$disconnect()
//     })