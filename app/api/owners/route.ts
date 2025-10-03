import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get('search') || ''

    // Récupérer tous les propriétaires uniques avec leur nombre de véhicules
    const owners = await prisma.vehicle.groupBy({
      by: ['ownerName'],
      _count: {
        ownerName: true
      },
      where: searchTerm ? {
        ownerName: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      } : {},
      orderBy: {
        _count: {
          ownerName: 'desc'
        }
      }
    })

    // Transformer les données pour correspondre à l'interface Owner
    const formattedOwners = owners.map((owner: any) => ({
      name: owner.ownerName,
      count: owner._count.ownerName
    }))

    return NextResponse.json(formattedOwners)
  } catch (error) {
    console.error('Erreur lors de la récupération des propriétaires:', error)
    return NextResponse.json({ error: "Erreur lors de la récupération des propriétaires" }, { status: 500 })
  }
}
