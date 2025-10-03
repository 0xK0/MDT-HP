import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { vehicleId, groupusculeId } = await request.json()

    if (!vehicleId || !groupusculeId) {
      return NextResponse.json({ error: 'ID du véhicule et du groupuscule requis' }, { status: 400 })
    }

    // Vérifier que le véhicule existe
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Véhicule non trouvé' }, { status: 404 })
    }

    // Vérifier que le groupuscule existe
    const groupuscule = await prisma.groupuscule.findUnique({
      where: { id: groupusculeId }
    })

    if (!groupuscule) {
      return NextResponse.json({ error: 'Groupuscule non trouvé' }, { status: 404 })
    }

    // Assigner le véhicule au groupuscule
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        groupusculeId: groupusculeId
      },
      include: {
        groupuscule: true,
        vehicleType: true,
        owner: true
      }
    })

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error('Erreur lors de l\'assignation du véhicule:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
