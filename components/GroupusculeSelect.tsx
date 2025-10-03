"use client"

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, X } from 'lucide-react'

interface Groupuscule {
  id: string
  name: string
  description?: string
}

interface GroupusculeSelectProps {
  value: string
  onChange: (value: string) => void
  hasGroupuscule: boolean
  onHasGroupusculeChange: (hasGroupuscule: boolean) => void
  placeholder?: string
}

export function GroupusculeSelect({ 
  value, 
  onChange, 
  hasGroupuscule,
  onHasGroupusculeChange,
  placeholder = "Sélectionner un groupuscule..." 
}: GroupusculeSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [groupuscules, setGroupuscules] = useState<Groupuscule[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGroupuscule, setSelectedGroupuscule] = useState<Groupuscule | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Charger les groupuscules
  useEffect(() => {
    const loadGroupuscules = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchTerm) {
          params.set('search', searchTerm)
        }
        
        const response = await fetch(`/api/groupuscules?${params.toString()}`)
        const data = await response.json()
        setGroupuscules(data)
      } catch (error) {
        console.error('Erreur lors du chargement des groupuscules:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGroupuscules()
  }, [searchTerm])

  // Charger le groupuscule sélectionné
  useEffect(() => {
    if (value && groupuscules.length > 0) {
      const groupuscule = groupuscules.find(g => g.id === value)
      setSelectedGroupuscule(groupuscule || null)
    } else {
      setSelectedGroupuscule(null)
    }
  }, [value, groupuscules])

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

  const handleSelect = (groupuscule: Groupuscule) => {
    onChange(groupuscule.id)
    setSelectedGroupuscule(groupuscule)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleClear = () => {
    onChange('')
    setSelectedGroupuscule(null)
    setSearchTerm('')
  }

  const handleCheckboxChange = (checked: boolean) => {
    onHasGroupusculeChange(checked)
    if (!checked) {
      handleClear()
    }
  }

  const filteredGroupuscules = groupuscules.filter(groupuscule =>
    groupuscule.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="hasGroupuscule"
          checked={hasGroupuscule}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="hasGroupuscule" className="ml-2 text-sm text-gray-300">
          Ce véhicule appartient à un groupuscule
        </label>
      </div>

      {hasGroupuscule && (
        <div className="relative" ref={dropdownRef}>
          <div
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white cursor-pointer flex items-center justify-between"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={selectedGroupuscule ? 'text-white' : 'text-gray-400'}>
              {selectedGroupuscule ? selectedGroupuscule.name : placeholder}
            </span>
            <div className="flex items-center space-x-2">
              {selectedGroupuscule && (
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
                  placeholder="Rechercher un groupuscule..."
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              {loading ? (
                <div className="px-3 py-2 text-gray-400 text-sm">Chargement...</div>
              ) : filteredGroupuscules.length > 0 ? (
                filteredGroupuscules.map((groupuscule) => (
                  <div
                    key={groupuscule.id}
                    className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-white text-sm"
                    onClick={() => handleSelect(groupuscule)}
                  >
                    <div className="font-medium">{groupuscule.name}</div>
                    {groupuscule.description && (
                      <div className="text-xs text-gray-400">{groupuscule.description}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-400 text-sm">
                  {searchTerm ? 'Aucun groupuscule trouvé' : 'Aucun groupuscule disponible'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!hasGroupuscule && (
        <div className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400">
          Aucune appartenance
        </div>
      )}
    </div>
  )
}
