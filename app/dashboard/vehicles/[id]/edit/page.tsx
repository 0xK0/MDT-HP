"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const [vehicle, setVehicle] = useState<any>(null)
  const [groupuscules, setGroupuscules] = useState<any[]>([])
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params
      
      try {
        // Charger les données du véhicule
        const vehicleResponse = await fetch(`/api/vehicles/${resolvedParams.id}`)
        if (vehicleResponse.ok) {
          const vehicleData = await vehicleResponse.json()
          setVehicle(vehicleData)
        }

        // Charger les groupuscules
        const groupusculesResponse = await fetch('/api/groupuscules')
        const groupusculesData = await groupusculesResponse.json()
        setGroupuscules(groupusculesData)

        // Charger les types de véhicules
        const typesResponse = await fetch('/api/vehicle-types')
        const typesData = await typesResponse.json()
        setVehicleTypes(typesData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
      
      setLoading(false)
    }
    loadData()
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const resolvedParams = await params
      const response = await fetch(`/api/vehicles/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicle),
      })

      if (response.ok) {
        router.push('/dashboard/vehicles')
      } else {
        const errorData = await response.json()
        alert(`Erreur: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Une erreur est survenue lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 hover:bg-gray-700 rounded"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-white">Modifier le véhicule</h1>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Modèle du véhicule
              </label>
              <input
                type="text"
                value={vehicle?.model || ''}
                onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Modèle du véhicule"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Plaque d'immatriculation
              </label>
              <input
                type="text"
                value={vehicle?.licensePlate || ''}
                onChange={(e) => setVehicle({ ...vehicle, licensePlate: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Plaque d'immatriculation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom du propriétaire
              </label>
              <input
                type="text"
                value={vehicle?.ownerName || ''}
                onChange={(e) => setVehicle({ ...vehicle, ownerName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Nom du propriétaire"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                N° de rapport associé
              </label>
              <input
                type="text"
                value={vehicle?.reportNumber || ''}
                onChange={(e) => setVehicle({ ...vehicle, reportNumber: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="N° de rapport associé"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type de véhicule
              </label>
              <select 
                value={vehicle?.vehicleTypeId || ''}
                onChange={(e) => setVehicle({ ...vehicle, vehicleTypeId: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="">Sélectionner un type</option>
                {vehicleTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Groupuscule
              </label>
              <select 
                value={vehicle?.groupusculeId || ''}
                onChange={(e) => setVehicle({ ...vehicle, groupusculeId: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="">Sélectionner un groupuscule</option>
                {groupuscules.map((groupuscule) => (
                  <option key={groupuscule.id} value={groupuscule.id}>
                    {groupuscule.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
