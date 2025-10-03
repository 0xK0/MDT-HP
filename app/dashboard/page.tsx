import { prisma } from "@/lib/prisma"
import { Car, Users, Building2, FileText } from "lucide-react"

async function getStats() {
  const [vehicleCount, groupusculeCount, userCount] = await Promise.all([
    prisma.vehicle.count(),
    prisma.groupuscule.count(),
    prisma.user.count(),
  ])

  return {
    vehicleCount,
    groupusculeCount,
    userCount,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  const statCards = [
    {
      name: "Véhicules enregistrés",
      value: stats.vehicleCount,
      icon: Car,
      color: "bg-blue-600",
    },
    {
      name: "Groupuscules",
      value: stats.groupusculeCount,
      icon: Building2,
      color: "bg-green-600",
    },
    {
      name: "Utilisateurs",
      value: stats.userCount,
      icon: Users,
      color: "bg-purple-600",
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
        <p className="text-gray-400 mt-2">
          Vue d'ensemble du système de gestion des véhicules
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.name} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-md ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">{card.name}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/dashboard/vehicles/new"
            className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Car className="h-5 w-5 text-blue-400 mr-3" />
            <span className="text-white">Ajouter un véhicule</span>
          </a>
          <a
            href="/dashboard/groupuscules/new"
            className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Building2 className="h-5 w-5 text-green-400 mr-3" />
            <span className="text-white">Créer un groupuscule</span>
          </a>
          <a
            href="/dashboard/users/new"
            className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Users className="h-5 w-5 text-purple-400 mr-3" />
            <span className="text-white">Ajouter un utilisateur</span>
          </a>
          <a
            href="/dashboard/vehicles"
            className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FileText className="h-5 w-5 text-yellow-400 mr-3" />
            <span className="text-white">Voir tous les véhicules</span>
          </a>
        </div>
      </div>
    </div>
  )
}
