"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { OwnerSelect } from '@/components/OwnerSelect'
import { VehicleTypeSelect } from '@/components/VehicleTypeSelect'
import { GroupusculeSelect } from '@/components/GroupusculeSelect'
import { ErrorDialog } from '@/components/ErrorDialog'

export default function NewVehiclePage() {
  const [formData, setFormData] = useState({
    licensePlate: "",
    ownerName: "",
    vehicleTypeId: "",
    groupusculeId: "",
  })
  const [groupuscules, setGroupuscules] = useState<any[]>([])
  const [hasGroupuscule, setHasGroupuscule] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  // Charger les groupuscules
  useEffect(() => {
    const loadGroupuscules = async () => {
      try {
        const response = await fetch('/api/groupuscules')
        const data = await response.json()
        setGroupuscules(data)
      } catch (error) {
        console.error('Erreur lors du chargement des groupuscules:', error)
      }
    }

    loadGroupuscules()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          groupusculeId: hasGroupuscule ? formData.groupusculeId : null,
        }),
      })

      if (response.ok) {
        router.push("/dashboard/vehicles")
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error)
        setShowErrorDialog(true)
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      setErrorMessage("Une erreur est survenue lors de la création du véhicule")
      setShowErrorDialog(true)
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

            <div className="md:col-span-2">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="hasGroupuscule"
                  checked={hasGroupuscule}
                  onChange={(e) => setHasGroupuscule(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="hasGroupuscule" className="text-sm font-medium text-gray-300">
                  Assigner à un groupuscule
                </label>
              </div>
              {hasGroupuscule && (
                <GroupusculeSelect
                  value={formData.groupusculeId}
                  onChange={(value) => setFormData({ ...formData, groupusculeId: value })}
                  hasGroupuscule={hasGroupuscule}
                  onHasGroupusculeChange={setHasGroupuscule}
                />
              )}
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

      {/* Pop-up d'erreur */}
      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        title="Erreur de création"
        message={errorMessage}
      />
    </div>
  )
}