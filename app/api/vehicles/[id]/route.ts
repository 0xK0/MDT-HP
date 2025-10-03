import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        groupuscule: true,
        vehicleType: true,
        vehicleModel: true,
        owner: true
      }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Véhicule non trouvé' }, { status: 404 })
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Erreur lors de la récupération du véhicule:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    // Trouver ou créer le propriétaire
    let owner = null
    if (data.ownerName) {
      owner = await prisma.owner.findUnique({
        where: { name: data.ownerName }
      })

      if (!owner) {
        owner = await prisma.owner.create({
          data: { name: data.ownerName }
        })
      }
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        model: data.model,
        licensePlate: data.licensePlate ? data.licensePlate.toUpperCase() : data.licensePlate,
        ownerName: data.ownerName,
        ownerId: owner?.id || null,
        reportNumber: data.reportNumber,
        photoProofDate: data.photoProofDate || null,
        groupusculeId: data.groupusculeId || null,
        vehicleTypeId: data.vehicleTypeId || null,
      },
      include: {
        groupuscule: true,
        vehicleType: true,
        vehicleModel: true,
        owner: true
      }
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du véhicule:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Vérifier que le véhicule existe
    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Véhicule non trouvé' }, { status: 404 })
    }

    await prisma.vehicle.delete({
      where: { id }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la suppression du véhicule:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}