import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Vérifier que le modèle de véhicule existe
    const vehicleModel = await prisma.vehicleModel.findUnique({
      where: { id }
    })

    if (!vehicleModel) {
      return NextResponse.json({ error: 'Modèle de véhicule non trouvé' }, { status: 404 })
    }

    await prisma.vehicleModel.delete({
      where: { id }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la suppression du modèle de véhicule:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
