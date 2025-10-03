"use client"

import Link from "next/link"
import { Plus, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, FileText, Trash2, Loader2 } from "lucide-react"
import React, { useState, useEffect } from "react"
import { ActionButtonsWithRole } from "@/components/ActionButtonsWithRole"
import { VehicleEditModal } from "@/components/VehicleEditModal"

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingVehicle, setEditingVehicle] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedVehicles, setExpandedVehicles] = useState<Set<string>>(new Set())
  const [showFactModal, setShowFactModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [factToDelete, setFactToDelete] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<'ADMIN' | 'USER'>('USER')
  const [factForm, setFactForm] = useState({
    title: "",
    description: "",
    reportNumber: "",
    photoProofDate: "",
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false
  })
  const itemsPerPage = 20

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          ...(searchTerm && { search: searchTerm })
        })
        
        const response = await fetch(`/api/vehicles?${params}`)
        const data = await response.json()
        
        if (data.vehicles && data.pagination) {
          setVehicles(data.vehicles)
          setPagination(data.pagination)
        } else {
          // Fallback pour l'ancienne structure
          setVehicles(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des véhicules:', error)
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

    loadVehicles()
  }, [currentPage, searchTerm, itemsPerPage])

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle)
    setShowEditModal(true)
  }

  const handleDeleteVehicle = async () => {
    // Recharger les véhicules après suppression
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm })
      })
      
      const response = await fetch(`/api/vehicles?${params}`)
      const data = await response.json()
      
      if (data.vehicles && data.pagination) {
        setVehicles(data.vehicles)
        setPagination(data.pagination)
      } else {
        setVehicles(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Erreur lors du rechargement des véhicules:', error)
    }
  }

  const handleSave = (updatedVehicle: any) => {
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v))
  }

  // Réinitialiser la page quand la recherche change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const toggleVehicleExpansion = (vehicleId: string) => {
    setExpandedVehicles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(vehicleId)) {
        newSet.delete(vehicleId)
      } else {
        newSet.add(vehicleId)
      }
      return newSet
    })
  }

  const handleAddFact = (vehicle: any) => {
    setEditingVehicle(vehicle)
    setFactForm({
      title: "",
      description: "",
      reportNumber: "",
      photoProofDate: "",
    })
    setShowFactModal(true)
  }

  const handleFactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!factForm.title) {
      alert("Le titre du fait est requis")
      return
    }

    try {
      const response = await fetch('/api/facts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...factForm,
          vehicleId: editingVehicle.id
        }),
      })

      if (response.ok) {
        // Recharger les véhicules pour mettre à jour les faits
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          ...(searchTerm && { search: searchTerm })
        })
        
        const vehiclesResponse = await fetch(`/api/vehicles?${params}`)
        const vehiclesData = await vehiclesResponse.json()
        
        if (vehiclesData.vehicles && vehiclesData.pagination) {
          setVehicles(vehiclesData.vehicles)
          setPagination(vehiclesData.pagination)
        }
        
        setShowFactModal(false)
        setEditingVehicle(null)
        setFactForm({
          title: "",
          description: "",
          reportNumber: "",
          photoProofDate: "",
        })
      } else {
        const error = await response.json()
        alert('Erreur: ' + error.error)
      }
    } catch (error) {
      alert('Erreur lors de la création du fait')
    }
  }

  const handleDeleteFact = (factId: string) => {
    setFactToDelete(factId)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteFact = async () => {
    if (!factToDelete) return

    try {
      const response = await fetch(`/api/facts/${factToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Recharger les véhicules pour mettre à jour les faits
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          ...(searchTerm && { search: searchTerm })
        })
        
        const vehiclesResponse = await fetch(`/api/vehicles?${params}`)
        const vehiclesData = await vehiclesResponse.json()
        
        if (vehiclesData.vehicles && vehiclesData.pagination) {
          setVehicles(vehiclesData.vehicles)
          setPagination(vehiclesData.pagination)
        }
        
        setShowDeleteConfirm(false)
        setFactToDelete(null)
      } else {
        const error = await response.json()
        alert('Erreur: ' + error.error)
      }
    } catch (error) {
      alert('Erreur lors de la suppression du fait')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Véhicules</h1>
          <p className="text-gray-400 mt-2">
            Gestion des véhicules enregistrés
          </p>
        </div>
        <Link
          href="/dashboard/vehicles/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un véhicule
        </Link>
      </div>

      {/* Recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par plaque, propriétaire, type ou groupuscule..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-gray-800 rounded-lg p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-4" />
            <p className="text-gray-400">Chargement des véhicules...</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
                  <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Plaque
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Propriétaire
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Groupuscule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Faits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {vehicles.map((vehicle: any) => (
                <React.Fragment key={vehicle.id}>
                  <tr 
                    className="hover:bg-gray-700 cursor-pointer"
                    onClick={() => toggleVehicleExpansion(vehicle.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      <div className="flex items-center">
                        {expandedVehicles.has(vehicle.id) ? (
                          <ChevronUp className="h-4 w-4 mr-2 text-blue-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 mr-2 text-blue-400" />
                        )}
                        {vehicle.vehicleType?.name || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {vehicle.licensePlate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {vehicle.ownerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {vehicle.groupuscule?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(vehicle.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1 text-blue-400" />
                        <span className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded-md text-xs">
                          {vehicle.facts?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        <ActionButtonsWithRole 
                          id={vehicle.id} 
                          type="vehicle" 
                          onEdit={() => handleEdit(vehicle)}
                          onDelete={handleDeleteVehicle}
                        />
                        <button
                          onClick={() => handleAddFact(vehicle)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Ajouter fait
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedVehicles.has(vehicle.id) && (
                    <tr>
                      <td colSpan={7} className="px-6 py-6 bg-gray-700">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold text-white flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-blue-400" />
                              Faits liés ({vehicle.facts?.length || 0})
                            </h4>
                          </div>
                          {vehicle.facts && vehicle.facts.length > 0 ? (
                            <div className="grid gap-3">
                              {vehicle.facts.map((fact: any) => (
                                <div key={fact.id} className="bg-gray-600 border border-gray-500 rounded-lg p-4 hover:bg-gray-500 transition-colors">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between">
                                        <h5 className="text-base font-semibold text-white mb-2">{fact.title}</h5>
                                        {userRole === 'ADMIN' && (
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleDeleteFact(fact.id)
                                            }}
                                            className="text-red-400 hover:text-red-300 ml-4 p-2 rounded hover:bg-red-900/20 transition-colors"
                                            title="Supprimer ce fait"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        )}
                                      </div>
                                      {fact.description && (
                                        <p className="text-sm text-gray-300 mb-3 leading-relaxed">{fact.description}</p>
                                      )}
                                      <div className="flex flex-wrap gap-4 text-xs">
                                        {fact.reportNumber && (
                                          <span className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded-md">
                                            📄 Rapport: {fact.reportNumber}
                                          </span>
                                        )}
                                        {fact.photoProofDate && (
                                          <span className="bg-green-900/30 text-green-300 px-2 py-1 rounded-md">
                                            📸 Photo: {fact.photoProofDate}
                                          </span>
                                        )}
                                        <span className="bg-gray-800 text-gray-400 px-2 py-1 rounded-md">
                                          📅 Créé: {new Date(fact.createdAt).toLocaleDateString("fr-FR")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                              <p className="text-gray-400 text-sm">Aucun fait lié à ce véhicule</p>
                              <p className="text-gray-500 text-xs mt-1">Cliquez sur "Ajouter fait" pour en créer un</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {vehicles.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {searchTerm ? 'Aucun véhicule trouvé' : 'Aucun véhicule enregistré'}
            </p>
          </div>
        )}
        </div>
      )}

      {/* Contrôles de pagination */}
      {vehicles.length > 0 && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-400">
            Affichage de {((pagination.currentPage - 1) * pagination.limit) + 1} à {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} sur {pagination.totalCount} véhicules
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-1 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    page === pagination.currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteConfirm(false)} />
            
            <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 bg-opacity-20">
                    <Trash2 className="h-6 w-6 text-red-400" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Supprimer le fait
                  </h3>
                  <p className="text-sm text-gray-300 mb-6">
                    Êtes-vous sûr de vouloir supprimer ce fait ? Cette action est irréversible.
                  </p>
                  <div className="flex space-x-3 justify-center">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={confirmDeleteFact}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création de fait */}
      {showFactModal && editingVehicle && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowFactModal(false)} />
            
            <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Ajouter un fait</h2>
                <button
                  onClick={() => setShowFactModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleFactSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Titre du fait *
                  </label>
                  <input
                    type="text"
                    value={factForm.title}
                    onChange={(e) => setFactForm({ ...factForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    placeholder="Titre du fait"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={factForm.description}
                    onChange={(e) => setFactForm({ ...factForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    placeholder="Description du fait"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Numéro de rapport
                    </label>
                    <input
                      type="text"
                      value={factForm.reportNumber}
                      onChange={(e) => setFactForm({ ...factForm, reportNumber: e.target.value })}
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
                      value={factForm.photoProofDate}
                      onChange={(e) => setFactForm({ ...factForm, photoProofDate: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      placeholder="Date photo preuve"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowFactModal(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    Créer le fait
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up d'édition */}
      <VehicleEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        vehicle={editingVehicle}
        onSave={handleSave}
      />
    </div>
  )
}
