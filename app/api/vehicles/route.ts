import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Calculer l'offset pour la pagination
    const skip = (page - 1) * limit

    // Construire les conditions de recherche
    const whereClause = search ? {
      OR: [
        { licensePlate: { contains: search, mode: 'insensitive' as const } },
        { ownerName: { contains: search, mode: 'insensitive' as const } },
        { groupuscule: { name: { contains: search, mode: 'insensitive' as const } } },
        { vehicleType: { name: { contains: search, mode: 'insensitive' as const } } }
      ]
    } : {}

    // Requête optimisée avec pagination
    const [vehicles, totalCount] = await Promise.all([
      prisma.vehicle.findMany({
        where: whereClause,
        include: {
          groupuscule: {
            select: {
              id: true,
              name: true
            }
          },
          vehicleType: {
            select: {
              id: true,
              name: true
            }
          },
          owner: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit
      }),
      prisma.vehicle.count({
        where: whereClause
      })
    ])

    // Récupérer les faits pour chaque véhicule
    const vehiclesWithFacts = await Promise.all(
      vehicles.map(async (vehicle) => {
        const facts = await prisma.fact.findMany({
          where: { vehicleId: vehicle.id },
          select: {
            id: true,
            title: true,
            description: true,
            reportNumber: true,
            photoProofDate: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        })

        // Récupérer tous les sabotages (actifs et inactifs) pour l'historique
        const allSabotages = await (prisma as any).sabotage.findMany({
          where: { 
            vehicleId: vehicle.id
          },
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            triggerFactId: true,
            affectedFactIds: true,
            reason: true,
            createdBy: true,
            isActive: true,
            createdAt: true
          }
        })

        // Enrichir tous les sabotages avec les titres et dates de création des faits déclencheurs
        const enrichedAllSabotages = await Promise.all(
          allSabotages.map(async (sabotage: any) => {
            const triggerFact = facts.find((f: any) => f.id === sabotage.triggerFactId)
            return {
              ...sabotage,
              triggerFactTitle: triggerFact?.title || 'Fait supprimé',
              triggerFactCreatedAt: triggerFact?.createdAt || null
            }
          })
        )

        // Séparer les sabotages actifs pour la logique
        const activeSabotages = enrichedAllSabotages.filter((s: any) => s.isActive)

        return { ...vehicle, facts, sabotages: activeSabotages, allSabotages: enrichedAllSabotages }
      })
    )

    // Calculer les métadonnées de pagination
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      vehicles: vehiclesWithFacts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules:', error)
    return NextResponse.json({ error: "Erreur lors de la récupération des véhicules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { model, licensePlate, ownerName, groupusculeId, vehicleTypeId } = body

    // Validation des champs requis
    if (!licensePlate || !ownerName) {
      return NextResponse.json({ error: 'La plaque et le propriétaire sont requis' }, { status: 400 })
    }

    // Vérifier l'unicité de la plaque d'immatriculation
    const existingVehicle = await prisma.vehicle.findFirst({
      where: { licensePlate: licensePlate.toUpperCase() }
    })

    if (existingVehicle) {
      return NextResponse.json({ error: 'Une plaque d\'immatriculation identique existe déjà' }, { status: 400 })
    }

    // Trouver ou créer le propriétaire
    let owner = await prisma.owner.findUnique({
      where: { name: ownerName }
    })

    if (!owner) {
      owner = await prisma.owner.create({
        data: { name: ownerName }
      })
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        model: "", // Champ vide par défaut
        licensePlate: licensePlate.toUpperCase(), // Conversion automatique en majuscules
        ownerName,
        ownerId: owner.id,
        reportNumber: "",
        photoProofDate: "",
        groupusculeId: groupusculeId || null,
        vehicleTypeId: vehicleTypeId || null,
      },
      include: {
        groupuscule: true,
        vehicleType: true,
        owner: true,
      },
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Erreur lors de la création du véhicule:', error)
    return NextResponse.json({ error: "Erreur lors de la création du véhicule" }, { status: 500 })
  }
}
