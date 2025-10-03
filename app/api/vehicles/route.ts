import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        groupuscule: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(vehicles)
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des véhicules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { model, licensePlate, ownerName, reportNumber, photoProofDate, groupusculeId, vehicleTypeId } = body

    const vehicle = await prisma.vehicle.create({
      data: {
        model,
        licensePlate: licensePlate.toUpperCase(), // Conversion automatique en majuscules
        ownerName,
        reportNumber,
        photoProofDate: photoProofDate || null,
        groupusculeId: groupusculeId || null,
        vehicleTypeId: vehicleTypeId || null,
      },
      include: {
        groupuscule: true,
        vehicleType: true,
      },
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Erreur lors de la création du véhicule:', error)
    return NextResponse.json({ error: "Erreur lors de la création du véhicule" }, { status: 500 })
  }
}
