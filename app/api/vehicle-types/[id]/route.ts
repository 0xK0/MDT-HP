import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Vérifier que le type de véhicule existe
    const vehicleType = await prisma.vehicleType.findUnique({
      where: { id }
    })

    if (!vehicleType) {
      return NextResponse.json({ error: 'Type de véhicule non trouvé' }, { status: 404 })
    }

    await prisma.vehicleType.delete({
      where: { id }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la suppression du type de véhicule:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
