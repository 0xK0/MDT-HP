"use client"

import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { GroupusculeSelect } from './GroupusculeSelect'
import { OwnerSelect } from './OwnerSelect'
import { VehicleTypeSelect } from './VehicleTypeSelect'

interface VehicleEditModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: any
  onSave: (updatedVehicle: any) => void
}

export function VehicleEditModal({ isOpen, onClose, vehicle, onSave }: VehicleEditModalProps) {
  const [formData, setFormData] = useState({
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

  // Charger les données du véhicule
  useEffect(() => {
    if (vehicle) {
      setFormData({
        licensePlate: vehicle.licensePlate || "",
        ownerName: vehicle.ownerName || "",
        reportNumber: vehicle.reportNumber || "",
        photoProofDate: vehicle.photoProofDate || "",
        groupusculeId: vehicle.groupusculeId || "",
        vehicleTypeId: vehicle.vehicleTypeId || "",
      })
      setHasGroupuscule(!!vehicle.groupusculeId)
    }
  }, [vehicle])

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

    if (isOpen) {
      loadGroupuscules()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation : au moins un des deux champs requis
    if (!formData.reportNumber && !formData.photoProofDate) {
      alert("Veuillez renseigner au moins le numéro de dossier ou la date photo preuve")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          groupusculeId: hasGroupuscule ? formData.groupusculeId : null,
        }),
      })

      if (response.ok) {
        const updatedVehicle = await response.json()
        onSave(updatedVehicle)
        onClose()
      } else {
        const error = await response.json()
        alert('Erreur: ' + error.error)
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour du véhicule')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Modifier le véhicule</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                  Propriétaire
                </label>
                <OwnerSelect
                  value={formData.ownerName}
                  onChange={(value: string) => setFormData({ ...formData, ownerName: value })}
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
                  placeholder="Numéro de rapport"
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
                  placeholder="Date photo preuve"
                />
              </div>
            </div>

            {/* Groupuscule */}
            <div>
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
                  onChange={(value: string) => setFormData({ ...formData, groupusculeId: value })}
                  hasGroupuscule={hasGroupuscule}
                  onHasGroupusculeChange={setHasGroupuscule}
                />
              )}
            </div>

            {/* Validation message */}
            <div className="text-sm text-gray-400">
              <p>⚠️ Au moins un des deux champs suivants doit être renseigné :</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>N° de rapport associé</li>
                <li>Date photo preuve</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
