import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const groupuscules = await prisma.groupuscule.findMany({
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
    })

    return NextResponse.json(groupuscule)
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du groupuscule" }, { status: 500 })
  }
}
