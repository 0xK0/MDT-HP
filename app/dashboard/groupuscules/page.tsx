import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Plus, Edit, Trash2, Users } from "lucide-react"

async function getGroupuscules() {
  return await prisma.groupuscule.findMany({
    include: {
      _count: {
        select: {
          vehicles: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })
}

export default async function GroupusculesPage() {
  const groupuscules = await getGroupuscules()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Groupuscules</h1>
          <p className="text-gray-400 mt-2">
            Gestion des groupuscules et organisations
          </p>
        </div>
        <Link
          href="/dashboard/groupuscules/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Créer un groupuscule
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupuscules.map((groupuscule) => (
          <div key={groupuscule.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {groupuscule.name}
                </h3>
                {groupuscule.description && (
                  <p className="text-gray-400 text-sm mb-4">
                    {groupuscule.description}
                  </p>
                )}
                <div className="flex items-center text-sm text-gray-400">
                  <Users className="h-4 w-4 mr-2" />
                  {groupuscule._count.vehicles} véhicule(s) associé(s)
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button className="text-yellow-400 hover:text-yellow-300">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-red-400 hover:text-red-300">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {groupuscules.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">Aucun groupuscule créé</p>
        </div>
      )}
    </div>
  )
}
