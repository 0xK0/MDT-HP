import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('🔍 Test d\'authentification pour:', email)
    
    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', email)
      return NextResponse.json({ 
        success: false, 
        error: 'Utilisateur non trouvé',
        user: null 
      })
    }
    
    console.log('✅ Utilisateur trouvé:', user.email)
    console.log('🔐 Mot de passe hashé:', user.password.substring(0, 20) + '...')
    
    // Tester la comparaison de mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    console.log('🔍 Test du mot de passe:', isPasswordValid ? '✅ Valide' : '❌ Invalide')
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      passwordValid: isPasswordValid
    })
    
  } catch (error) {
    console.error('❌ Erreur lors du test d\'authentification:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    })
  }
}
