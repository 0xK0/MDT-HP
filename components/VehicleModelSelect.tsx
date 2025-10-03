"use client"

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, X } from 'lucide-react'

interface VehicleModel {
  id: string
  name: string
  vehicleType: {
    id: string
    name: string
  }
}

interface VehicleModelSelectProps {
  value: string
  onChange: (value: string) => void
  vehicleTypeId?: string
  placeholder?: string
}

export function VehicleModelSelect({ 
  value, 
  onChange, 
  vehicleTypeId, 
  placeholder = "Sélectionner un modèle..." 
}: VehicleModelSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [models, setModels] = useState<VehicleModel[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Charger les modèles
  useEffect(() => {
    const loadModels = async () => {
      if (!vehicleTypeId) return
      
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('vehicleTypeId', vehicleTypeId)
        if (searchTerm) {
          params.set('search', searchTerm)
        }
        
        const response = await fetch(`/api/vehicle-models?${params.toString()}`)
        const data = await response.json()
        setModels(data)
      } catch (error) {
        console.error('Erreur lors du chargement des modèles:', error)
      } finally {
        setLoading(false)
      }
    }

    loadModels()
  }, [vehicleTypeId, searchTerm])

  // Charger le modèle sélectionné
  useEffect(() => {
    if (value && models.length > 0) {
      const model = models.find(m => m.id === value)
      setSelectedModel(model || null)
    } else {
      setSelectedModel(null)
    }
  }, [value, models])

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

  const handleSelect = (model: VehicleModel) => {
    onChange(model.id)
    setSelectedModel(model)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleClear = () => {
    onChange('')
    setSelectedModel(null)
    setSearchTerm('')
  }

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedModel ? 'text-white' : 'text-gray-400'}>
          {selectedModel ? selectedModel.name : placeholder}
        </span>
        <div className="flex items-center space-x-2">
          {selectedModel && (
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
              placeholder="Rechercher un modèle..."
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {loading ? (
            <div className="px-3 py-2 text-gray-400 text-sm">Chargement...</div>
          ) : filteredModels.length > 0 ? (
            filteredModels.map((model) => (
              <div
                key={model.id}
                className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-white text-sm"
                onClick={() => handleSelect(model)}
              >
                {model.name}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400 text-sm">
              {searchTerm ? 'Aucun modèle trouvé' : 'Aucun modèle disponible'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
