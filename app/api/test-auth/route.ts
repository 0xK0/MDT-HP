import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log("Test d'authentification pour:", { email, hasPassword: !!password })
    
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: "Email et mot de passe requis" 
      }, { status: 400 })
    }

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    })

    console.log("Utilisateur trouvé:", user ? { id: user.id, email: user.email, name: user.name } : "Aucun utilisateur")

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: "Utilisateur non trouvé" 
      }, { status: 404 })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    console.log("Mot de passe valide:", isPasswordValid)

    if (!isPasswordValid) {
      return NextResponse.json({ 
        success: false, 
        error: "Mot de passe incorrect" 
      }, { status: 401 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Authentification réussie",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    console.error("Erreur lors du test d'authentification:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Erreur interne du serveur",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 })
  }
}
