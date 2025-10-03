import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Test de connexion à la base de données
    await prisma.$connect()
    
    // Test de requête simple
    const userCount = await prisma.user.count()
    
    return NextResponse.json({ 
      success: true, 
      message: "Connexion à la base de données réussie",
      userCount 
    })
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Erreur de connexion à la base de données",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
