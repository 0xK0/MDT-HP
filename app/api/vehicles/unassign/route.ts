import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { vehicleId } = await request.json()

    if (!vehicleId) {
      return NextResponse.json({ error: 'ID du véhicule requis' }, { status: 400 })
    }

    // Vérifier que le véhicule existe
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Véhicule non trouvé' }, { status: 404 })
    }

    // Retirer le véhicule du groupuscule
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        groupusculeId: null
      },
      include: {
        groupuscule: true,
        vehicleType: true,
        owner: true
      }
    })

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error('Erreur lors du retrait du véhicule:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
