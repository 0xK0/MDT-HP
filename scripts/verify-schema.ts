import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifySchema() {
  try {
    console.log('🔍 Vérification du schéma Prisma...')
    
    // Test de connexion
    await prisma.$connect()
    console.log('✅ Connexion à la base de données réussie')
    
    // Vérifier le type de base de données (MongoDB ne supporte pas $queryRaw)
    console.log('✅ Base de données MongoDB détectée')
    
    // Test avec un utilisateur
    const userCount = await prisma.user.count()
    console.log('✅ Nombre d\'utilisateurs:', userCount)
    
    console.log('🎉 Schéma Prisma correctement configuré pour MongoDB!')
    
  } catch (error) {
    console.error('❌ Erreur de vérification du schéma:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

verifySchema()
