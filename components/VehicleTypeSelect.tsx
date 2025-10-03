"use client"

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, X, Plus } from 'lucide-react'

interface VehicleType {
  id: string
  name: string
  description?: string
  _count: {
    vehicles: number
  }
}

interface VehicleTypeSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function VehicleTypeSelect({ 
  value, 
  onChange, 
  placeholder = "Sélectionner ou saisir un type de véhicule..." 
}: VehicleTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddOption, setShowAddOption] = useState(false)
  const [selectedType, setSelectedType] = useState<VehicleType | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Charger tous les types de véhicules au montage
  useEffect(() => {
    const loadVehicleTypes = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/vehicle-types')
        const data = await response.json()
        setVehicleTypes(data)
      } catch (error) {
        console.error('Erreur lors du chargement des types de véhicules:', error)
      } finally {
        setLoading(false)
      }
    }

    loadVehicleTypes()
  }, [])

  // Déterminer si on doit afficher l'option d'ajout
  useEffect(() => {
    if (searchTerm && !vehicleTypes.some(type => 
      type.name.toLowerCase() === searchTerm.toLowerCase()
    )) {
      setShowAddOption(true)
    } else {
      setShowAddOption(false)
    }
  }, [searchTerm, vehicleTypes])

  // Charger le type sélectionné
  useEffect(() => {
    if (value && vehicleTypes.length > 0) {
      const type = vehicleTypes.find(t => t.id === value)
      setSelectedType(type || null)
    } else {
      setSelectedType(null)
    }
  }, [value, vehicleTypes])

  // Synchroniser searchTerm avec la value initiale
  useEffect(() => {
    if (value && vehicleTypes.length > 0) {
      const type = vehicleTypes.find(t => t.id === value)
      if (type && type.name !== searchTerm) {
        setSearchTerm(type.name)
      }
    }
  }, [value, vehicleTypes])

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (type: VehicleType) => {
    onChange(type.id)
    setSelectedType(type)
    setSearchTerm(type.name)
    setIsOpen(false)
  }

  const handleAddNew = async () => {
    if (!searchTerm.trim()) return

    try {
      const response = await fetch('/api/vehicle-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: searchTerm.trim(),
          description: ''
        }),
      })

      if (response.ok) {
        const newType = await response.json()
        setVehicleTypes(prev => [...prev, newType])
        handleSelect(newType)
      } else {
        const error = await response.json()
        alert(`Erreur: ${error.error}`)
      }
    } catch (error) {
      console.error('Erreur lors de la création du type:', error)
      alert('Erreur lors de la création du type de véhicule')
    }
  }

  const handleClear = () => {
    onChange('')
    setSelectedType(null)
    setSearchTerm('')
  }

  const filteredTypes = vehicleTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedType ? 'text-white' : 'text-gray-400'}>
          {selectedType ? selectedType.name : placeholder}
        </span>
        <div className="flex items-center space-x-2">
          {selectedType && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher ou créer un type..."
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {loading ? (
            <div className="px-3 py-2 text-gray-400 text-sm">Chargement...</div>
          ) : (
            <>
              {filteredTypes.map((type) => (
                <div
                  key={type.id}
                  className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-white text-sm"
                  onClick={() => handleSelect(type)}
                >
                  <div className="font-medium">{type.name}</div>
                  <div className="text-xs text-gray-400">
                    {type._count.vehicles} véhicule(s)
                  </div>
                </div>
              ))}
              
              {showAddOption && (
                <div
                  className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-blue-400 text-sm flex items-center"
                  onClick={handleAddNew}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer "{searchTerm}"
                </div>
              )}
              
              {filteredTypes.length === 0 && !showAddOption && (
                <div className="px-3 py-2 text-gray-400 text-sm">
                  Aucun type trouvé
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
