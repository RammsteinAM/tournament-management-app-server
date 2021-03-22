import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  try {
    await prisma.tournamentType.create({
      data: {
        id: 1,
        name: 'Elimination'
      }
    })
  } catch (error) {

  }
  try {
    await prisma.tournamentType.create({
      data: {
        id: 2,
        name: 'Last Man Standing'
      }
    })
  } catch (error) {

  }
  try {
    await prisma.tournamentType.create({
      data: {
        id: 3,
        name: 'Round Robin'
      }
    })
  } catch (error) {

  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })