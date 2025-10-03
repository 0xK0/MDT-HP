"use client"

import Link from "next/link"
import { Plus, Users, Car, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { ActionButtonsWithRole } from "@/components/ActionButtonsWithRole"
import { ConfirmDialog } from "@/components/ConfirmDialog"

export default function GroupusculesPage() {
  const [groupuscules, setGroupuscules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGroupuscule, setSelectedGroupuscule] = useState<any>(null)
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [userRole, setUserRole] = useState<'ADMIN' | 'USER'>('USER')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [vehicleToRemove, setVehicleToRemove] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    const loadGroupuscules = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/groupuscules')
        const data = await response.json()
        setGroupuscules(data)
      } catch (error) {
        console.error('Erreur lors de la récupération des groupuscules:', error)
      } finally {
        setLoading(false)
      }
    }

    // Charger le rôle utilisateur
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUserRole(userData.role)
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error)
      }
    }

    loadGroupuscules()
  }, [])

  const handleAddVehicle = async (groupuscule: any) => {
    setSelectedGroupuscule(groupuscule)
    setShowAddVehicle(true)
    setSearchTerm("")
    
    // Charger les véhicules existants
    try {
      setLoadingVehicles(true)
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      
      // Filtrer les véhicules pour éviter les doublons de plaque
      const uniqueVehicles = data.reduce((acc: any[], vehicle: any) => {
        const existingVehicle = acc.find(v => v.licensePlate === vehicle.licensePlate)
        if (!existingVehicle) {
          acc.push(vehicle)
        }
        return acc
      }, [])
      
      setVehicles(uniqueVehicles)
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error)
    } finally {
      setLoadingVehicles(false)
    }
  }

  const handleAssignVehicle = async (vehicleId: string) => {
    try {
      const response = await fetch('/api/vehicles/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId: vehicleId,
          groupusculeId: selectedGroupuscule.id,
        }),
      })

      if (response.ok) {
        // Recharger les groupuscules
        const groupusculesResponse = await fetch('/api/groupuscules')
        const groupusculesData = await groupusculesResponse.json()
        setGroupuscules(groupusculesData)
        
        // Fermer le modal
        setShowAddVehicle(false)
        setSelectedGroupuscule(null)
        setVehicles([])
        setSearchTerm("")
      } else {
        const error = await response.json()
        alert('Erreur: ' + error.error)
      }
    } catch (error) {
      alert('Erreur lors de l\'assignation du véhicule')
    }
  }

  const handleUnassignVehicle = (vehicle: any) => {
    setVehicleToRemove(vehicle)
    setShowConfirmDialog(true)
  }

  const confirmUnassignVehicle = async () => {
    if (!vehicleToRemove) return

    try {
      const response = await fetch('/api/vehicles/unassign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId: vehicleToRemove.id,
        }),
      })

      if (response.ok) {
        // Recharger les groupuscules
        const groupusculesResponse = await fetch('/api/groupuscules')
        const groupusculesData = await groupusculesResponse.json()
        setGroupuscules(groupusculesData)
      } else {
        const error = await response.json()
        alert('Erreur: ' + error.error)
      }
    } catch (error) {
      alert('Erreur lors du retrait du véhicule')
    } finally {
      setShowConfirmDialog(false)
      setVehicleToRemove(null)
    }
  }

  // Filtrer les véhicules selon le terme de recherche
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vehicle.vehicleType?.name && vehicle.vehicleType.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Calculer la pagination pour les groupuscules
  const totalPages = Math.ceil(groupuscules.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedGroupuscules = groupuscules.slice(startIndex, endIndex)

  // Réinitialiser la page quand la recherche change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Groupuscules</h1>
          <p className="text-gray-400 mt-2">
            Gestion des groupuscules et organisations
          </p>
        </div>
        <Link
          href="/dashboard/groupuscules/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Créer un groupuscule
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedGroupuscules.map((groupuscule: any) => (
          <div key={groupuscule.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {groupuscule.name}
                </h3>
                {groupuscule.description && (
                  <p className="text-gray-400 text-sm mb-4">
                    {groupuscule.description}
                  </p>
                )}
                <div className="flex items-center text-sm text-gray-400">
                  <Users className="h-4 w-4 mr-2" />
                  {groupuscule._count?.vehicles || 0} véhicule(s) associé(s)
                </div>
              </div>
              <div className="ml-4 flex space-x-2">
                <button
                  onClick={() => handleAddVehicle(groupuscule)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
                  title="Ajouter un véhicule"
                >
                  <Car className="h-4 w-4 mr-1" />
                  Ajouter véhicule
                </button>
                <ActionButtonsWithRole id={groupuscule.id} type="groupuscule" />
              </div>
            </div>
            
            {groupuscule.vehicles && groupuscule.vehicles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Véhicules :</h4>
                <div className="space-y-2">
                  {groupuscule.vehicles.map((vehicle: any) => (
                    <div key={vehicle.id} className="bg-gray-700 rounded p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-sm text-white font-medium">
                            {vehicle.licensePlate}
                          </div>
                          <div className="text-xs text-gray-400">
                            {vehicle.ownerName} • {vehicle.model}
                            {vehicle.vehicleType && ` • ${vehicle.vehicleType.name}`}
                          </div>
                        </div>
                        {userRole === 'ADMIN' && (
                          <button
                            onClick={() => handleUnassignVehicle(vehicle)}
                            className="text-red-400 hover:text-red-300 p-1 ml-2"
                            title="Retirer du groupuscule"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {groupuscules.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">Aucun groupuscule créé</p>
        </div>
      )}

      {/* Contrôles de pagination */}
      {groupuscules.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-400">
            Affichage de {startIndex + 1} à {Math.min(endIndex, groupuscules.length)} sur {groupuscules.length} groupuscules
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de sélection de véhicule */}
      {showAddVehicle && selectedGroupuscule && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddVehicle(false)} />
            
            <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">
                  Assigner un véhicule à {selectedGroupuscule.name}
                </h2>
                <button
                  onClick={() => setShowAddVehicle(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Plus className="h-6 w-6 rotate-45" />
                </button>
              </div>

              {/* Recherche */}
              <div className="p-6 border-b border-gray-700">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par plaque, propriétaire ou type..."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Liste des véhicules */}
              <div className="p-6">
                {loadingVehicles ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400">Chargement des véhicules...</div>
                  </div>
                ) : filteredVehicles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredVehicles.map((vehicle: any) => (
                      <div key={vehicle.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {vehicle.licensePlate}
                            </h3>
                            <p className="text-sm text-gray-300 mb-1">
                              {vehicle.ownerName}
                            </p>
                            {vehicle.vehicleType?.name && (
                              <p className="text-xs text-gray-400">
                                {vehicle.vehicleType.name}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-400">
                            {vehicle.reportNumber && `Rapport: ${vehicle.reportNumber}`}
                            {vehicle.photoProofDate && ` • Photo: ${vehicle.photoProofDate}`}
                          </div>
                          <button
                            onClick={() => handleAssignVehicle(vehicle.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
                          >
                            <Car className="h-4 w-4 mr-1" />
                            Assigner
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400">
                      {searchTerm ? 'Aucun véhicule trouvé' : 'Aucun véhicule disponible'}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-700">
                <button
                  onClick={() => setShowAddVehicle(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up de confirmation */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false)
          setVehicleToRemove(null)
        }}
        onConfirm={confirmUnassignVehicle}
        title="Retirer le véhicule"
        message={`Êtes-vous sûr de vouloir retirer le véhicule ${vehicleToRemove?.licensePlate} du groupuscule ?`}
        confirmText="Retirer"
        cancelText="Annuler"
      />
    </div>
  )
}
