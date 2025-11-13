import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicleId, isSabotaged } = body

    if (!vehicleId || typeof isSabotaged !== 'boolean') {
      return NextResponse.json({ error: 'vehicleId et isSabotaged sont requis' }, { status: 400 })
    }

    // Mettre à jour le véhicule
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { isSabotaged }
    })

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du sabotage du véhicule:', error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du sabotage" }, { status: 500 })
  }
}
