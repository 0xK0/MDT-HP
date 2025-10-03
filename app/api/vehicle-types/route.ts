import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where: any = {}
    
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      }
    }

    const vehicleTypes = await prisma.vehicleType.findMany({
      where,
      include: {
        _count: {
          select: {
            vehicles: true
          }
        }
      },
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

    // Vérifier si le type existe déjà
    const existingType = await prisma.vehicleType.findUnique({
      where: { name }
    })

    if (existingType) {
      return NextResponse.json({ error: 'Ce type de véhicule existe déjà' }, { status: 400 })
    }

    const vehicleType = await prisma.vehicleType.create({
      data: {
        name,
        description: description || null
      },
      include: {
        _count: {
          select: {
            vehicles: true
          }
        }
      }
    })

    return NextResponse.json(vehicleType, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du type de véhicule:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
