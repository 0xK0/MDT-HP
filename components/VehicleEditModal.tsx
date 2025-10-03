"use client"

import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { OwnerSelect } from './OwnerSelect'
import { VehicleTypeSelect } from './VehicleTypeSelect'
import { ErrorDialog } from './ErrorDialog'

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
    vehicleTypeId: "",
  })
  const [loading, setLoading] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Charger les données du véhicule
  useEffect(() => {
    if (vehicle) {
      setFormData({
        licensePlate: vehicle.licensePlate || "",
        ownerName: vehicle.ownerName || "",
        vehicleTypeId: vehicle.vehicleTypeId || "",
      })
    }
  }, [vehicle])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)

    try {
      const response = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedVehicle = await response.json()
        onSave(updatedVehicle)
        onClose()
      } else {
        const error = await response.json()
        setErrorMessage(error.error)
        setShowErrorDialog(true)
      }
    } catch (error) {
      setErrorMessage('Erreur lors de la mise à jour du véhicule')
      setShowErrorDialog(true)
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

      {/* Pop-up d'erreur */}
      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        title="Erreur de modification"
        message={errorMessage}
      />
    </div>
  )
}
