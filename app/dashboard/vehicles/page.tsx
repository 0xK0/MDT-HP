"use client"

import Link from "next/link"
import { Plus, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, FileText, Trash2, Loader2, AlertTriangle, Check, Edit } from "lucide-react"
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
  const [editingFact, setEditingFact] = useState<any>(null)
  const [isEditingFact, setIsEditingFact] = useState(false)
  const [showSabotageReasonModal, setShowSabotageReasonModal] = useState(false)
  const [sabotageReason, setSabotageReason] = useState("")
  const [pendingSabotage, setPendingSabotage] = useState<{vehicleId: string, factIndex: number, facts: any[]} | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<'ADMIN' | 'USER'>('USER')
  const [sabotagedVehicles, setSabotagedVehicles] = useState<Set<string>>(new Set())
  const [sabotagedFacts, setSabotagedFacts] = useState<Set<string>>(new Set())
  const [activeTriggerFacts, setActiveTriggerFacts] = useState<Set<string>>(new Set())
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
          
          // Charger les états de sabotage depuis la BDD
          const sabotagedVehiclesSet = new Set<string>()
          const sabotagedFactsSet = new Set<string>()
          const activeTriggerFactsSet = new Set<string>()
          
          data.vehicles.forEach((vehicle: any) => {
            if (vehicle.sabotages && vehicle.sabotages.length > 0) {
              sabotagedVehiclesSet.add(vehicle.id)
              
              // Ajouter tous les faits affectés par les sabotages
              vehicle.sabotages.forEach((sabotage: any) => {
                if (sabotage.isActive) {
                  // Ajouter le fait déclencheur
                  activeTriggerFactsSet.add(sabotage.triggerFactId)
                  
                  // Ajouter tous les faits affectés
                  sabotage.affectedFactIds.forEach((factId: string) => {
                    sabotagedFactsSet.add(factId)
                  })
                }
              })
            }
          })
          
          setSabotagedVehicles(sabotagedVehiclesSet)
          setSabotagedFacts(sabotagedFactsSet)
          setActiveTriggerFacts(activeTriggerFactsSet)
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

    // Charger le rôle utilisateur et l'utilisateur actuel
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUserRole(userData.role)
        setCurrentUser(userData)
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
    setEditingFact(null)
    setIsEditingFact(false)
    setFactForm({
      title: "",
      description: "",
      reportNumber: "",
      photoProofDate: "",
    })
    setShowFactModal(true)
  }

  const handleEditFact = (fact: any) => {
    setEditingFact(fact)
    setIsEditingFact(true)
    setFactForm({
      title: fact.title || "",
      description: fact.description || "",
      reportNumber: fact.reportNumber || "",
      photoProofDate: fact.photoProofDate || "",
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
      let response
      if (isEditingFact && editingFact) {
        // Mise à jour d'un fait existant
        response = await fetch(`/api/facts/${editingFact.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...factForm
          }),
        })
      } else {
        // Création d'un nouveau fait
        response = await fetch('/api/facts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...factForm,
            vehicleId: editingVehicle.id
          }),
        })
      }

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
          
          // Recharger les états de sabotage
          const sabotagedVehiclesSet = new Set<string>()
          const sabotagedFactsSet = new Set<string>()
          const activeTriggerFactsSet = new Set<string>()
          
          vehiclesData.vehicles.forEach((vehicle: any) => {
            if (vehicle.sabotages && vehicle.sabotages.length > 0) {
              sabotagedVehiclesSet.add(vehicle.id)
              
              vehicle.sabotages.forEach((sabotage: any) => {
                if (sabotage.isActive) {
                  activeTriggerFactsSet.add(sabotage.triggerFactId)
                  
                  sabotage.affectedFactIds.forEach((factId: string) => {
                    sabotagedFactsSet.add(factId)
                  })
                }
              })
            }
          })
          
          setSabotagedVehicles(sabotagedVehiclesSet)
          setSabotagedFacts(sabotagedFactsSet)
          setActiveTriggerFacts(activeTriggerFactsSet)
        }
        
        setShowFactModal(false)
        setEditingVehicle(null)
        setEditingFact(null)
        setIsEditingFact(false)
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
      alert(isEditingFact ? 'Erreur lors de la modification du fait' : 'Erreur lors de la création du fait')
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

  const handleSabotage = (vehicleId: string, factIndex: number, facts: any[]) => {
    const triggerFact = facts[factIndex]
    
    // Vérifier si ce fait déclencheur a déjà un sabotage actif
    const existingSabotage = activeTriggerFacts.has(triggerFact.id)
    
    if (existingSabotage) {
      // Désactiver le sabotage directement sans demander de raison
      confirmSabotage(vehicleId, factIndex, facts, false, "")
    } else {
      // Activer le sabotage : demander la raison
      setPendingSabotage({ vehicleId, factIndex, facts })
      setSabotageReason("")
      setShowSabotageReasonModal(true)
    }
  }

  const confirmSabotage = async (vehicleId: string, factIndex: number, facts: any[], isActive: boolean, reason: string) => {
    const triggerFact = facts[factIndex]
    const factsToUpdate = facts.slice(factIndex, Math.min(factIndex + 5, facts.length))
    const affectedFactIds = factsToUpdate.map(fact => fact.id)
    
    const userName = currentUser?.name || currentUser?.email || "Utilisateur inconnu"

    try {
      // Sauvegarder le sabotage en BDD
      await fetch('/api/sabotages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          triggerFactId: triggerFact.id,
          vehicleId,
          affectedFactIds,
          isActive,
          reason: reason || null,
          createdBy: userName
        })
      })

      // Mettre à jour l'état du fait déclencheur
      setActiveTriggerFacts(prev => {
        const newSet = new Set(prev)
        if (isActive) {
          newSet.add(triggerFact.id)
        } else {
          newSet.delete(triggerFact.id)
        }
        return newSet
      })

      // Mettre à jour l'état local des faits affectés
      setSabotagedFacts(prev => {
        const newSet = new Set(prev)
        if (isActive) {
          // Ajouter tous les faits affectés
          affectedFactIds.forEach(factId => newSet.add(factId))
        } else {
          // Supprimer tous les faits affectés
          affectedFactIds.forEach(factId => newSet.delete(factId))
        }
        return newSet
      })

      // Mettre à jour l'état du véhicule (orange si au moins un sabotage actif)
      setSabotagedVehicles(prev => {
        const newSet = new Set(prev)
        // Mettre à jour activeTriggerFacts d'abord pour avoir l'état à jour
        const updatedTriggerFacts = new Set(activeTriggerFacts)
        if (isActive) {
          updatedTriggerFacts.add(triggerFact.id)
        } else {
          updatedTriggerFacts.delete(triggerFact.id)
        }
        
        // Vérifier s'il y a au moins un sabotage actif pour ce véhicule
        const hasActiveSabotage = Array.from(updatedTriggerFacts).some(factId => {
          const fact = facts.find(f => f.id === factId)
          return fact
        })
        
        if (hasActiveSabotage) {
          newSet.add(vehicleId)
        } else {
          newSet.delete(vehicleId)
        }
        return newSet
      })

      // Recharger les véhicules pour mettre à jour l'affichage
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
        
        // Recharger les états de sabotage
        const sabotagedVehiclesSet = new Set<string>()
        const sabotagedFactsSet = new Set<string>()
        const activeTriggerFactsSet = new Set<string>()
        
        vehiclesData.vehicles.forEach((vehicle: any) => {
          if (vehicle.sabotages && vehicle.sabotages.length > 0) {
            sabotagedVehiclesSet.add(vehicle.id)
            
            vehicle.sabotages.forEach((sabotage: any) => {
              if (sabotage.isActive) {
                activeTriggerFactsSet.add(sabotage.triggerFactId)
                
                sabotage.affectedFactIds.forEach((factId: string) => {
                  sabotagedFactsSet.add(factId)
                })
              }
            })
          }
        })
        
        setSabotagedVehicles(sabotagedVehiclesSet)
        setSabotagedFacts(sabotagedFactsSet)
        setActiveTriggerFacts(activeTriggerFactsSet)
      }

      // Fermer le modal si ouvert
      setShowSabotageReasonModal(false)
      setPendingSabotage(null)
      setSabotageReason("")
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du sabotage:', error)
      alert('Erreur lors de la sauvegarde du sabotage')
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
                      Sabot
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
                    className={`hover:bg-gray-700 cursor-pointer ${
                      sabotagedVehicles.has(vehicle.id) 
                        ? 'bg-orange-900/30 border-l-4 border-orange-500' 
                        : (vehicle.facts?.length || 0) >= 5 
                          ? 'bg-yellow-900/30 border-l-4 border-yellow-500' 
                          : ''
                    }`}
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
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {(() => {
                        // Trouver le dernier sabotage actif (le plus récent)
                        const activeSabotages = vehicle.sabotages || []
                        const lastActiveSabotage = activeSabotages.length > 0 
                          ? activeSabotages.sort((a: any, b: any) => 
                              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                            )[0]
                          : null

                        return lastActiveSabotage ? (
                          <div className="flex flex-col gap-2 max-w-xs">
                            <div className="flex items-center mb-1">
                              <AlertTriangle className="h-4 w-4 mr-1 text-orange-400" />
                              <span className="bg-orange-900/30 text-orange-300 px-2 py-1 rounded-md text-xs font-semibold">
                                Sous sabot
                              </span>
                            </div>
                            <div className="p-2 rounded border bg-orange-900/20 border-orange-500/50">
                              <div className="font-semibold text-white text-xs mb-1">
                                {lastActiveSabotage.triggerFactTitle}
                              </div>
                              {lastActiveSabotage.reason && (
                                <div className="text-gray-300 text-xs mb-1">
                                  {lastActiveSabotage.reason}
                                </div>
                              )}
                              <div className="flex items-center justify-between text-gray-400 text-xs">
                                <span>{lastActiveSabotage.createdBy || 'Inconnu'}</span>
                                <span>
                                  {lastActiveSabotage.triggerFactCreatedAt 
                                    ? new Date(lastActiveSabotage.triggerFactCreatedAt).toLocaleDateString("fr-FR")
                                    : 'Date inconnue'
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">Aucun</span>
                        )
                      })()}
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
                      <td colSpan={8} className="px-6 py-6 bg-gray-700">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold text-white flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-blue-400" />
                              Faits liés ({vehicle.facts?.length || 0})
                            </h4>
                          </div>
                          {vehicle.facts && vehicle.facts.length > 0 ? (
                            <div className="grid gap-3">
                              {vehicle.facts.map((fact: any, index: number) => {
                                const isFifthFact = (vehicle.facts.length - index) % 5 === 0 && vehicle.facts.length >= 5
                                const isFactSabotaged = sabotagedFacts.has(fact.id)
                                return (
                                  <div key={fact.id} className={`bg-gray-600 border border-gray-500 rounded-lg p-4 hover:bg-gray-500 transition-colors ${
                                    isFifthFact ? 'border-yellow-400 border-2' : ''
                                  } ${
                                    isFactSabotaged ? 'bg-green-900/30 border-green-500 border-2' : ''
                                  }`}>
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                          <div className="flex items-center">
                                            <h5 className="text-base font-semibold text-white mb-2">{fact.title}</h5>
                                            {isFifthFact && (
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  handleSabotage(vehicle.id, index, vehicle.facts)
                                                }}
                                                className={`ml-3 px-3 py-1 rounded-md text-sm flex items-center transition-colors ${
                                                  activeTriggerFacts.has(fact.id) 
                                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                                }`}
                                                title={activeTriggerFacts.has(fact.id) ? "Désactiver le sabot" : "Marquer comme saboté"}
                                              >
                                                {activeTriggerFacts.has(fact.id) ? (
                                                  <Check className="h-4 w-4 mr-1" />
                                                ) : (
                                                  <AlertTriangle className="h-4 w-4 mr-1" />
                                                )}
                                                SABOT
                                              </button>
                                            )}
                                          </div>
                                        <div className="flex items-center space-x-2">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleEditFact(fact)
                                            }}
                                            className="text-blue-400 hover:text-blue-300 p-2 rounded hover:bg-blue-900/20 transition-colors"
                                            title="Modifier ce fait"
                                          >
                                            <Edit className="h-4 w-4" />
                                          </button>
                                          {userRole === 'ADMIN' && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteFact(fact.id)
                                              }}
                                              className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-900/20 transition-colors"
                                              title="Supprimer ce fait"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </button>
                                          )}
                                        </div>
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
                                )
                              })} 
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

      {/* Modal de création/édition de fait */}
      {showFactModal && (editingVehicle || editingFact) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => {
              setShowFactModal(false)
              setEditingFact(null)
              setIsEditingFact(false)
              setFactForm({
                title: "",
                description: "",
                reportNumber: "",
                photoProofDate: "",
              })
            }} />
            
            <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">
                  {isEditingFact ? "Modifier le fait" : "Ajouter un fait"}
                </h2>
                <button
                  onClick={() => {
                    setShowFactModal(false)
                    setEditingFact(null)
                    setIsEditingFact(false)
                    setFactForm({
                      title: "",
                      description: "",
                      reportNumber: "",
                      photoProofDate: "",
                    })
                  }}
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
                    onClick={() => {
                      setShowFactModal(false)
                      setEditingFact(null)
                      setIsEditingFact(false)
                      setFactForm({
                        title: "",
                        description: "",
                        reportNumber: "",
                        photoProofDate: "",
                      })
                    }}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    {isEditingFact ? "Modifier le fait" : "Créer le fait"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de raison de sabotage */}
      {showSabotageReasonModal && pendingSabotage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => {
              setShowSabotageReasonModal(false)
              setPendingSabotage(null)
              setSabotageReason("")
            }} />
            
            <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Raison du sabotage</h2>
                <button
                  onClick={() => {
                    setShowSabotageReasonModal(false)
                    setPendingSabotage(null)
                    setSabotageReason("")
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pourquoi ce véhicule est-il mis sous sabot ? *
                  </label>
                  <textarea
                    value={sabotageReason}
                    onChange={(e) => setSabotageReason(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    placeholder="Ex: Accumulation de 5 faits, Infraction grave, etc."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSabotageReasonModal(false)
                      setPendingSabotage(null)
                      setSabotageReason("")
                    }}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (sabotageReason.trim()) {
                        confirmSabotage(
                          pendingSabotage.vehicleId,
                          pendingSabotage.factIndex,
                          pendingSabotage.facts,
                          true,
                          sabotageReason
                        )
                      } else {
                        alert("Veuillez indiquer la raison du sabotage")
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  >
                    Mettre sous sabot
                  </button>
                </div>
              </div>
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
