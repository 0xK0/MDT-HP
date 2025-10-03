import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get('search') || ''

    // Récupérer tous les propriétaires avec leur nombre de véhicules
    const owners = await prisma.owner.findMany({
      where: searchTerm ? {
        name: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      } : {},
      include: {
        _count: {
          select: {
            vehicles: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Transformer les données pour correspondre à l'interface Owner
    const formattedOwners = owners.map((owner: any) => ({
      name: owner.name,
      count: owner._count.vehicles
    }))

    return NextResponse.json(formattedOwners)
  } catch (error) {
    console.error('Erreur lors de la récupération des propriétaires:', error)
    return NextResponse.json({ error: "Erreur lors de la récupération des propriétaires" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Le nom du propriétaire est requis" }, { status: 400 })
    }

    // Vérifier si le propriétaire existe déjà
    const existingOwner = await prisma.owner.findUnique({
      where: { name: name.trim() }
    })

    if (existingOwner) {
      return NextResponse.json({ error: "Ce propriétaire existe déjà" }, { status: 400 })
    }

    // Créer le nouveau propriétaire
    const owner = await prisma.owner.create({
      data: {
        name: name.trim()
      },
      include: {
        _count: {
          select: {
            vehicles: true
          }
        }
      }
    })

    return NextResponse.json({
      name: owner.name,
      count: owner._count.vehicles
    })
  } catch (error) {
    console.error('Erreur lors de la création du propriétaire:', error)
    return NextResponse.json({ error: "Erreur lors de la création du propriétaire" }, { status: 500 })
  }
}
