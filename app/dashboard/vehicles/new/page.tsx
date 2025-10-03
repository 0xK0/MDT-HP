"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { GroupusculeSelect } from '@/components/GroupusculeSelect'
import { OwnerSelect } from '@/components/OwnerSelect'
import { VehicleTypeSelect } from '@/components/VehicleTypeSelect'

export default function NewVehiclePage() {
  const [formData, setFormData] = useState({
    model: "",
    licensePlate: "",
    ownerName: "",
    reportNumber: "",
    photoProofDate: "",
    groupusculeId: "",
    vehicleTypeId: "",
  })
  const [groupuscules, setGroupuscules] = useState<any[]>([])
  const [hasGroupuscule, setHasGroupuscule] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Charger les données au montage du composant
  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les groupuscules
        const groupusculesResponse = await fetch('/api/groupuscules')
        const groupusculesData = await groupusculesResponse.json()
        setGroupuscules(groupusculesData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
    }

    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation : au moins un des deux champs doit être rempli
    if (!formData.reportNumber && !formData.photoProofDate) {
      alert("Veuillez renseigner au moins le numéro de dossier ou la date photo preuve")
      return
    }
    
    setLoading(true)

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          groupusculeId: hasGroupuscule ? formData.groupusculeId : null
        }),
      })

      if (response.ok) {
        router.push("/dashboard/vehicles")
      } else {
        const errorData = await response.json()
        alert(`Erreur: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      alert("Une erreur est survenue lors de la création du véhicule")
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-3xl font-bold text-white">Nouveau Véhicule</h1>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type de véhicule
              </label>
              <VehicleTypeSelect
                value={formData.vehicleTypeId}
                onChange={(value: string) => setFormData({ ...formData, vehicleTypeId: value })}
                placeholder="Sélectionner ou saisir un type de véhicule..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Plaque d'immatriculation
              </label>
              <input
                type="text"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Plaque d'immatriculation"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom du propriétaire
              </label>
              <OwnerSelect
                value={formData.ownerName}
                onChange={(value) => setFormData({ ...formData, ownerName: value })}
                placeholder="Sélectionner ou saisir un propriétaire..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                N° de rapport associé
              </label>
              <input
                type="text"
                value={formData.reportNumber}
                onChange={(e) => setFormData({ ...formData, reportNumber: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="N° de rapport associé"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date photo preuve
              </label>
              <input
                type="text"
                value={formData.photoProofDate}
                onChange={(e) => setFormData({ ...formData, photoProofDate: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Date photo preuve (optionnel)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Appartenance
              </label>
              <GroupusculeSelect
                value={formData.groupusculeId}
                onChange={(value) => setFormData({ ...formData, groupusculeId: value })}
                hasGroupuscule={hasGroupuscule}
                onHasGroupusculeChange={setHasGroupuscule}
                placeholder="Sélectionner un groupuscule..."
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? "Création..." : "Créer le véhicule"}
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