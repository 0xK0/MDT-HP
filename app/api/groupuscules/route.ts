import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where = search ? {
      name: {
        contains: search,
        mode: 'insensitive' as const
      }
    } : {}

    const groupuscules = await prisma.groupuscule.findMany({
      where,
      include: {
        vehicles: {
          include: {
            vehicleType: true
          }
        },
        _count: {
          select: { vehicles: true }
        }
      },
      orderBy: {
        name: "asc",
      },
    })
    return NextResponse.json(groupuscules)
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des groupuscules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    const groupuscule = await prisma.groupuscule.create({
      data: {
        name,
        description,
      },
      include: {
        vehicles: {
          include: {
            vehicleType: true
          }
        },
        _count: {
          select: { vehicles: true }
        }
      },
    })

    return NextResponse.json(groupuscule)
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du groupuscule" }, { status: 500 })
  }
}
