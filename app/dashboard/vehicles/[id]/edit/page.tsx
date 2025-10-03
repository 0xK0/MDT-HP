"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const [vehicle, setVehicle] = useState<any>(null)
  const [groupuscules, setGroupuscules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params
      
      // Charger les groupuscules
      try {
        const response = await fetch('/api/groupuscules')
        const data = await response.json()
        setGroupuscules(data)
      } catch (error) {
        console.error('Erreur lors du chargement des groupuscules:', error)
      }
      
      setLoading(false)
    }
    loadData()
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      // Logique de sauvegarde
      console.log('Sauvegarde du véhicule')
      router.push('/dashboard/vehicles')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="N° de rapport associé"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Groupuscule
              </label>
              <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
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
