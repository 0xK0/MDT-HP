import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Vérifier que le groupuscule existe
    const groupuscule = await prisma.groupuscule.findUnique({
      where: { id }
    })

    if (!groupuscule) {
      return NextResponse.json(
        { error: 'Groupuscule non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer le groupuscule (les véhicules associés seront supprimés automatiquement)
    await prisma.groupuscule.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression du groupuscule:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
