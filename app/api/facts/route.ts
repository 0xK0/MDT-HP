import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')

    if (!vehicleId) {
      return NextResponse.json({ error: "vehicleId est requis" }, { status: 400 })
    }

    const facts = await prisma.fact.findMany({
      where: {
        vehicleId: vehicleId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(facts)
  } catch (error) {
    console.error('Erreur lors de la récupération des faits:', error)
    return NextResponse.json({ error: "Erreur lors de la récupération des faits" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, reportNumber, photoProofDate, vehicleId } = body

    // Validation des champs requis
    if (!title || !vehicleId) {
      return NextResponse.json({ error: 'Le titre et l\'ID du véhicule sont requis' }, { status: 400 })
    }

    const fact = await prisma.fact.create({
      data: {
        title,
        description: description || null,
        reportNumber: reportNumber || null,
        photoProofDate: photoProofDate || null,
        vehicleId
      }
    })

    return NextResponse.json(fact)
  } catch (error) {
    console.error('Erreur lors de la création du fait:', error)
    return NextResponse.json({ error: "Erreur lors de la création du fait" }, { status: 500 })
  }
}
