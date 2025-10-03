import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleTypeId = searchParams.get('vehicleTypeId')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (vehicleTypeId) {
      where.vehicleTypeId = vehicleTypeId
    }
    
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      }
    }

    const vehicleModels = await prisma.vehicleModel.findMany({
      where,
      include: {
        vehicleType: true
      },
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json(vehicleModels)
  } catch (error) {
    console.error('Erreur lors de la récupération des modèles de véhicules:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, vehicleTypeId } = await request.json()

    if (!name || !vehicleTypeId) {
      return NextResponse.json({ error: 'Le nom et le type de véhicule sont requis' }, { status: 400 })
    }

    const vehicleModel = await prisma.vehicleModel.create({
      data: {
        name,
        vehicleTypeId,
      },
      include: {
        vehicleType: true
      }
    })

    return NextResponse.json(vehicleModel, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du modèle de véhicule:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
