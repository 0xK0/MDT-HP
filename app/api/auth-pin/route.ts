import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Code PIN requis" }, { status: 400 })
    }

    console.log("Tentative d'authentification avec le code PIN:", code)

    // Rechercher le code PIN
    const pinCode = await prisma.pinCode.findUnique({
      where: { 
        code,
        isActive: true
      }
    })

    if (!pinCode) {
      console.log("Code PIN non trouvé ou inactif:", code)
      return NextResponse.json({ error: "Code PIN incorrect" }, { status: 401 })
    }

    console.log("Code PIN trouvé:", { id: pinCode.id, type: pinCode.type, name: pinCode.name })

    // Retourner les informations de session
    return NextResponse.json({
      success: true,
      user: {
        id: pinCode.id,
        code: pinCode.code,
        type: pinCode.type,
        name: pinCode.name,
        role: pinCode.type === 'ADMIN' ? 'ADMIN' : 'USER'
      }
    })

  } catch (error) {
    console.error('Erreur lors de l\'authentification par PIN:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
