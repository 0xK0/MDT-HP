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

  // Créer quelques types de véhicules d'exemple
  const vehicleTypes = await Promise.all([
    prisma.vehicleType.upsert({
      where: { name: 'Voiture' },
      update: {},
      create: {
        name: 'Voiture',
        description: 'Véhicule de tourisme',
      },
    }),
    prisma.vehicleType.upsert({
      where: { name: 'Moto' },
      update: {},
      create: {
        name: 'Moto',
        description: 'Véhicule à deux roues',
      },
    }),
    prisma.vehicleType.upsert({
      where: { name: 'Camion' },
      update: {},
      create: {
        name: 'Camion',
        description: 'Véhicule utilitaire',
      },
    }),
  ])

  // Créer quelques véhicules d'exemple
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        model: 'BMW X5',
        licensePlate: 'AB-123-CD',
        ownerName: 'Jean Dupont',
        reportNumber: 'RPT-2024-001',
        groupusculeId: groupuscules[0].id,
        vehicleTypeId: vehicleTypes[0].id,
      },
    }),
    prisma.vehicle.create({
      data: {
        model: 'Mercedes Classe A',
        licensePlate: 'EF-456-GH',
        ownerName: 'Marie Martin',
        reportNumber: 'RPT-2024-002',
        groupusculeId: groupuscules[1].id,
        vehicleTypeId: vehicleTypes[0].id,
      },
    }),
    prisma.vehicle.create({
      data: {
        model: 'Audi A4',
        licensePlate: 'IJ-789-KL',
        ownerName: 'Pierre Durand',
        reportNumber: 'RPT-2024-003',
        groupusculeId: groupuscules[2].id,
        vehicleTypeId: vehicleTypes[0].id,
      },
    }),
  ])

  console.log('Seed terminé avec succès!')
  console.log('Utilisateur admin créé:', admin.email)
  console.log('Groupuscules créés:', groupuscules.length)
  console.log('Types de véhicules créés:', vehicleTypes.length)
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
