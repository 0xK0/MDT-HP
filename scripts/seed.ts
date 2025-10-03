import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Créer un utilisateur admin par défaut
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mdt-hp.com' },
    update: {},
    create: {
      email: 'admin@mdt-hp.com',
      password: hashedPassword,
      name: 'Administrateur',
      role: 'ADMIN',
    },
  })

  // Créer quelques groupuscules d'exemple
  const groupuscules = await Promise.all([
    prisma.groupuscule.upsert({
      where: { name: 'Les Aigles' },
      update: {},
      create: {
        name: 'Les Aigles',
        description: 'Organisation criminelle majeure',
      },
    }),
    prisma.groupuscule.upsert({
      where: { name: 'Les Loups' },
      update: {},
      create: {
        name: 'Les Loups',
        description: 'Groupe de motards',
      },
    }),
    prisma.groupuscule.upsert({
      where: { name: 'Les Serpents' },
      update: {},
      create: {
        name: 'Les Serpents',
        description: 'Organisation de trafic de drogue',
      },
    }),
  ])

  // Créer quelques véhicules d'exemple
  const vehicles = await Promise.all([
    prisma.vehicle.upsert({
      where: { id: 'vehicle-1' },
      update: {},
      create: {
        id: 'vehicle-1',
        model: 'BMW X5',
        licensePlate: 'AB-123-CD',
        ownerName: 'Jean Dupont',
        reportNumber: 'RPT-2024-001',
        groupusculeId: groupuscules[0].id,
      },
    }),
    prisma.vehicle.upsert({
      where: { id: 'vehicle-2' },
      update: {},
      create: {
        id: 'vehicle-2',
        model: 'Mercedes Classe A',
        licensePlate: 'EF-456-GH',
        ownerName: 'Marie Martin',
        reportNumber: 'RPT-2024-002',
        groupusculeId: groupuscules[1].id,
      },
    }),
    prisma.vehicle.upsert({
      where: { id: 'vehicle-3' },
      update: {},
      create: {
        id: 'vehicle-3',
        model: 'Audi A4',
        licensePlate: 'IJ-789-KL',
        ownerName: 'Pierre Durand',
        reportNumber: 'RPT-2024-003',
        groupusculeId: groupuscules[2].id,
      },
    }),
  ])

  console.log('Seed terminé avec succès!')
  console.log('Utilisateur admin créé:', admin.email)
  console.log('Groupuscules créés:', groupuscules.length)
  console.log('Véhicules créés:', vehicles.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
