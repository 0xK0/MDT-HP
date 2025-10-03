import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testAuth() {
  try {
    console.log('🔍 Test d\'authentification...')
    
    // Vérifier que l'utilisateur admin existe
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@mdt-hp.com' }
    })
    
    if (!admin) {
      console.log('❌ Utilisateur admin non trouvé')
      return
    }
    
    console.log('✅ Utilisateur admin trouvé:', admin.email)
    console.log('📧 Email:', admin.email)
    console.log('👤 Nom:', admin.name)
    console.log('🔑 Rôle:', admin.role)
    console.log('🔐 Mot de passe hashé:', admin.password.substring(0, 20) + '...')
    
    // Tester la comparaison de mot de passe
    const testPassword = 'admin123'
    const isPasswordValid = await bcrypt.compare(testPassword, admin.password)
    
    console.log('🔍 Test du mot de passe "admin123":', isPasswordValid ? '✅ Valide' : '❌ Invalide')
    
    // Tester avec un mauvais mot de passe
    const wrongPassword = 'wrongpassword'
    const isWrongPasswordValid = await bcrypt.compare(wrongPassword, admin.password)
    
    console.log('🔍 Test du mot de passe "wrongpassword":', isWrongPasswordValid ? '✅ Valide' : '❌ Invalide')
    
    // Afficher tous les utilisateurs
    const allUsers = await prisma.user.findMany()
    console.log('👥 Tous les utilisateurs:', allUsers.map(u => ({ email: u.email, name: u.name, role: u.role })))
    
  } catch (error) {
    console.error('❌ Erreur lors du test d\'authentification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAuth()
