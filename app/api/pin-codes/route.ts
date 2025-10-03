import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const pinCodes = await prisma.pinCode.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(pinCodes)
  } catch (error) {
    console.error('Erreur lors de la récupération des codes PIN:', error)
    return NextResponse.json({ error: "Erreur lors de la récupération des codes PIN" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, type, name } = body

    if (!code || !type || !name) {
      return NextResponse.json({ error: "Code, type et nom sont requis" }, { status: 400 })
    }

    // Vérifier si le code existe déjà
    const existingPin = await prisma.pinCode.findUnique({
      where: { code }
    })

    if (existingPin) {
      return NextResponse.json({ error: "Ce code PIN existe déjà" }, { status: 400 })
    }

    const pinCode = await prisma.pinCode.create({
      data: {
        code,
        type,
        name,
      }
    })

    return NextResponse.json(pinCode)
  } catch (error) {
    console.error('Erreur lors de la création du code PIN:', error)
    return NextResponse.json({ error: "Erreur lors de la création du code PIN" }, { status: 500 })
  }
}
