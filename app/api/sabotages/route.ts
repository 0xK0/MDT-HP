import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { triggerFactId, vehicleId, affectedFactIds, isActive, reason, createdBy } = body

    if (!triggerFactId || !vehicleId || !Array.isArray(affectedFactIds)) {
      return NextResponse.json({ error: 'triggerFactId, vehicleId et affectedFactIds sont requis' }, { status: 400 })
    }

    // Vérifier si un sabotage existe déjà pour ce fait déclencheur
    const existingSabotage = await (prisma as any).sabotage.findFirst({
      where: { triggerFactId }
    })

    if (existingSabotage) {
      // Mettre à jour le sabotage existant
      const updatedSabotage = await (prisma as any).sabotage.update({
        where: { id: existingSabotage.id },
        data: { 
          affectedFactIds,
          isActive: isActive ?? true,
          reason: reason || existingSabotage.reason,
          createdBy: createdBy || existingSabotage.createdBy
        }
      })
      return NextResponse.json(updatedSabotage)
    } else {
      // Créer un nouveau sabotage
      const newSabotage = await (prisma as any).sabotage.create({
        data: {
          triggerFactId,
          vehicleId,
          affectedFactIds,
          isActive: isActive ?? true,
          reason: reason || null,
          createdBy: createdBy || null
        }
      })
      return NextResponse.json(newSabotage)
    }
  } catch (error) {
    console.error('Erreur lors de la gestion du sabotage:', error)
    return NextResponse.json({ error: "Erreur lors de la gestion du sabotage" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const activeOnly = searchParams.get('activeOnly') === 'true'

    if (!vehicleId) {
      return NextResponse.json({ error: "vehicleId est requis" }, { status: 400 })
    }

    const whereClause: any = { vehicleId }
    if (activeOnly) {
      whereClause.isActive = true
    }

    const sabotages = await (prisma as any).sabotage.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        triggerFact: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json(sabotages)
  } catch (error) {
    console.error('Erreur lors de la récupération des sabotages:', error)
    return NextResponse.json({ error: "Erreur lors de la récupération des sabotages" }, { status: 500 })
  }
}
