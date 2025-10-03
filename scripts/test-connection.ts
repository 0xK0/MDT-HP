import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Test de connexion à MongoDB...')
    
    // Test de connexion basique
    await prisma.$connect()
    console.log('✅ Connexion à MongoDB réussie!')
    
    // Test de requête simple
    const userCount = await prisma.user.count()
    console.log(`✅ Nombre d'utilisateurs: ${userCount}`)
    
    // Test de création d'un utilisateur de test
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'test123',
        name: 'Test User',
        role: 'USER'
      }
    })
    console.log('✅ Utilisateur de test créé:', testUser.email)
    
    // Nettoyer l'utilisateur de test
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    console.log('✅ Utilisateur de test supprimé')
    
    console.log('🎉 Tous les tests de connexion ont réussi!')
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
