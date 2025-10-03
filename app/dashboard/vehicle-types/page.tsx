import Link from "next/link"
import { Plus } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ActionButtons } from "@/components/ActionButtons"

export const dynamic = 'force-dynamic'

async function getVehicleTypes() {
  try {
    const vehicleTypes = await prisma.vehicleType.findMany({
      include: {
        _count: {
          select: { vehicles: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return vehicleTypes
  } catch (error) {
    console.error('Erreur lors de la récupération des types de véhicules:', error)
    return []
  }
}

export default async function VehicleTypesPage() {
  const vehicleTypes = await getVehicleTypes()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Types de Véhicules</h1>
          <p className="text-gray-400 mt-2">
            Gestion des types de véhicules
          </p>
        </div>
        <Link
          href="/dashboard/vehicle-types/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un type
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Véhicules
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date de création
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {vehicleTypes.map((vehicleType: any) => (
                <tr key={vehicleType.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {vehicleType.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {vehicleType.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {vehicleType._count.vehicles}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(vehicleType.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <ActionButtons id={vehicleType.id} type="vehicle-type" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {vehicleTypes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Aucun type de véhicule créé</p>
          </div>
        )}
      </div>
    </div>
  )
}
