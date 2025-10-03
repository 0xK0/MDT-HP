import Link from "next/link"
import { Plus, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ActionButtons } from "@/components/ActionButtons"

export const dynamic = 'force-dynamic'

async function getGroupuscules() {
  try {
    const groupuscules = await prisma.groupuscule.findMany({
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
      orderBy: { createdAt: 'desc' }
    })
    return groupuscules
  } catch (error) {
    console.error('Erreur lors de la récupération des groupuscules:', error)
    return []
  }
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
        {groupuscules.map((groupuscule: any) => (
          <div key={groupuscule.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
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
              <div className="ml-4">
                <ActionButtons id={groupuscule.id} type="groupuscule" />
              </div>
            </div>
            
            {groupuscule.vehicles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Véhicules :</h4>
                <div className="space-y-2">
                  {groupuscule.vehicles.map((vehicle: any) => (
                    <div key={vehicle.id} className="bg-gray-700 rounded p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-sm text-white font-medium">
                            {vehicle.licensePlate}
                          </div>
                          <div className="text-xs text-gray-400">
                            {vehicle.ownerName} • {vehicle.model}
                            {vehicle.vehicleType && ` • ${vehicle.vehicleType.name}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
