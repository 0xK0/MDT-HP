"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default function NewVehiclePage() {
  const [formData, setFormData] = useState({
    model: "",
    licensePlate: "",
    ownerName: "",
    reportNumber: "",
    groupusculeId: "",
  })
  const [groupuscules, setGroupuscules] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Charger les groupuscules au montage du composant
  useState(() => {
    fetch("/api/groupuscules")
      .then(res => res.json())
      .then(data => setGroupuscules(data))
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
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/dashboard/vehicles")
      } else {
        console.error("Erreur lors de la création du véhicule")
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Nouveau véhicule</h1>
        <p className="text-gray-400 mt-2">
          Enregistrer un nouveau véhicule dans le système
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">
                Modèle du véhicule *
              </label>
              <input
                type="text"
                id="model"
                name="model"
                required
                value={formData.model}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: BMW X5, Mercedes Classe A..."
              />
            </div>

            <div>
              <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-300 mb-2">
                Plaque d'immatriculation *
              </label>
              <input
                type="text"
                id="licensePlate"
                name="licensePlate"
                required
                value={formData.licensePlate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: AB-123-CD"
              />
            </div>

            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-300 mb-2">
                Nom du propriétaire *
              </label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                required
                value={formData.ownerName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Jean Dupont"
              />
            </div>

            <div>
              <label htmlFor="reportNumber" className="block text-sm font-medium text-gray-300 mb-2">
                N° de rapport associé *
              </label>
              <input
                type="text"
                id="reportNumber"
                name="reportNumber"
                required
                value={formData.reportNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: RPT-2024-001"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="groupusculeId" className="block text-sm font-medium text-gray-300 mb-2">
                Appartenance (Groupuscule) *
              </label>
              <select
                id="groupusculeId"
                name="groupusculeId"
                required
                value={formData.groupusculeId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner un groupuscule</option>
                {groupuscules.map((groupuscule: any) => (
                  <option key={groupuscule.id} value={groupuscule.id}>
                    {groupuscule.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
