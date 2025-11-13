import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { factIds, isSabotaged } = body

    if (!Array.isArray(factIds) || typeof isSabotaged !== 'boolean') {
      return NextResponse.json({ error: 'factIds (array) et isSabotaged sont requis' }, { status: 400 })
    }

    // Mettre à jour tous les faits
    const updatedFacts = await prisma.fact.updateMany({
      where: { id: { in: factIds } },
      data: { isSabotaged: isSabotaged } as any
    })

    return NextResponse.json({ updatedCount: updatedFacts.count })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du sabotage des faits:', error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du sabotage des faits" }, { status: 500 })
  }
}
