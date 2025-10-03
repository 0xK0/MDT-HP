import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, reportNumber, photoProofDate } = body

    // Validation des champs requis
    if (!title) {
      return NextResponse.json({ error: 'Le titre est requis' }, { status: 400 })
    }

    const fact = await prisma.fact.update({
      where: { id },
      data: {
        title,
        description: description || null,
        reportNumber: reportNumber || null,
        photoProofDate: photoProofDate || null,
      }
    })

    return NextResponse.json(fact)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du fait:', error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du fait" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.fact.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Fait supprimé avec succès" })
  } catch (error) {
    console.error('Erreur lors de la suppression du fait:', error)
    return NextResponse.json({ error: "Erreur lors de la suppression du fait" }, { status: 500 })
  }
}
