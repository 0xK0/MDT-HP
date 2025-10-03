"use client"

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, X } from 'lucide-react'

interface VehicleType {
  id: string
  name: string
  description?: string
}

interface VehicleModelSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function VehicleModelSelect({ 
  value, 
  onChange, 
  placeholder = "Sélectionner un type de véhicule..." 
}: VehicleModelSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<VehicleType | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Charger les types de véhicules
  useEffect(() => {
    const loadVehicleTypes = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchTerm) {
          params.set('search', searchTerm)
        }
        
        const response = await fetch(`/api/vehicle-types?${params.toString()}`)
        const data = await response.json()
        setVehicleTypes(data)
      } catch (error) {
        console.error('Erreur lors du chargement des types de véhicules:', error)
      } finally {
        setLoading(false)
      }
    }

    loadVehicleTypes()
  }, [searchTerm])

  // Charger le type sélectionné
  useEffect(() => {
    if (value && vehicleTypes.length > 0) {
      const type = vehicleTypes.find(t => t.id === value)
      setSelectedType(type || null)
    } else {
      setSelectedType(null)
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
    setIsOpen(false)
    setSearchTerm('')
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
              placeholder="Rechercher un type..."
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {loading ? (
            <div className="px-3 py-2 text-gray-400 text-sm">Chargement...</div>
          ) : filteredTypes.length > 0 ? (
            filteredTypes.map((type) => (
              <div
                key={type.id}
                className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-white text-sm"
                onClick={() => handleSelect(type)}
              >
                <div className="font-medium">{type.name}</div>
                {type.description && (
                  <div className="text-xs text-gray-400">{type.description}</div>
                )}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400 text-sm">
              {searchTerm ? 'Aucun type trouvé' : 'Aucun type disponible'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
