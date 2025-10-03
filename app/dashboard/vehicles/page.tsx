import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ActionButtonsWithRole } from "@/components/ActionButtonsWithRole"
import { VehicleSearch } from "@/components/VehicleSearch"

export const dynamic = 'force-dynamic'

async function getVehicles(searchTerm?: string) {
  try {
    const where = searchTerm ? {
      OR: [
        { model: { contains: searchTerm, mode: 'insensitive' as const } },
        { licensePlate: { contains: searchTerm, mode: 'insensitive' as const } },
        { ownerName: { contains: searchTerm, mode: 'insensitive' as const } },
        { groupuscule: { name: { contains: searchTerm, mode: 'insensitive' as const } } }
      ]
    } : {}

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        groupuscule: true,
        vehicleType: true,
        vehicleModel: true,
        owner: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return vehicles
  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules:', error)
    return []
  }
}

export default async function VehiclesPage({ searchParams }: { searchParams: { search?: string } }) {
  const searchTerm = searchParams.search
  const vehicles = await getVehicles(searchTerm)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Véhicules</h1>
          <p className="text-gray-400 mt-2">
            Gestion des véhicules enregistrés
          </p>
        </div>
        <Link
          href="/dashboard/vehicles/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un véhicule
        </Link>
      </div>

      <div className="mb-6">
        <VehicleSearch />
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Modèle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Plaque
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Propriétaire
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Groupuscule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      N° Rapport
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date photo preuve
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {vehicles.map((vehicle: any) => (
                <tr key={vehicle.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {vehicle.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {vehicle.licensePlate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {vehicle.ownerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {vehicle.groupuscule?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {vehicle.reportNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {vehicle.photoProofDate || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(vehicle.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <ActionButtonsWithRole id={vehicle.id} type="vehicle" />
                      </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {vehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Aucun véhicule enregistré</p>
          </div>
        )}
      </div>
    </div>
  )
}
