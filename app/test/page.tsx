import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function TestPage() {
  try {
    // Tester la connexion à la base de données
    const userCount = await prisma.user.count()
    const groupusculeCount = await prisma.groupuscule.count()
    const vehicleCount = await prisma.vehicle.count()

    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
      }
    })

    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Test de la Base de Données</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-2">Utilisateurs</h2>
            <p className="text-3xl text-blue-400">{userCount}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-2">Groupuscules</h2>
            <p className="text-3xl text-green-400">{groupusculeCount}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-2">Véhicules</h2>
            <p className="text-3xl text-purple-400">{vehicleCount}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">Utilisateurs en Base</h2>
          <div className="space-y-2">
            {users.map((user: { email: string; name: string; role: string }, index: number) => (
              <div key={index} className="text-gray-300">
                <strong>Email:</strong> {user.email} | 
                <strong> Nom:</strong> {user.name} | 
                <strong> Rôle:</strong> {user.role}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 bg-green-900 text-green-300 rounded-lg">
          ✅ Base de données fonctionnelle ! Vous pouvez vous connecter avec admin@mdt-hp.com / admin123
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Erreur de Base de Données</h1>
        <div className="bg-red-900 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-red-300 mb-4">Erreur</h2>
          <p className="text-red-300">{error instanceof Error ? error.message : 'Erreur inconnue'}</p>
        </div>
      </div>
    )
  }
}