import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const vehicleTypes = await prisma.vehicleType.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(vehicleTypes)
  } catch (error) {
    console.error('Erreur lors de la récupération des types de véhicules:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    }

    const vehicleType = await prisma.vehicleType.create({
      data: {
        name,
        description: description || null,
      }
    })

    return NextResponse.json(vehicleType, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du type de véhicule:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
