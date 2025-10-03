"use client"

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, X, Plus } from 'lucide-react'

interface Owner {
  name: string
  count: number
}

interface OwnerSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function OwnerSelect({ 
  value, 
  onChange, 
  placeholder = "Sélectionner ou saisir un propriétaire..." 
}: OwnerSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddOption, setShowAddOption] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Charger tous les propriétaires au montage du composant
  useEffect(() => {
    const loadAllOwners = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/owners')
        const data = await response.json()
        setOwners(data)
      } catch (error) {
        console.error('Erreur lors du chargement des propriétaires:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAllOwners()
  }, [])

  // Synchroniser searchTerm avec la value initiale
  useEffect(() => {
    if (value && value !== searchTerm) {
      setSearchTerm(value)
    }
  }, [value])

  // Vérifier si on peut ajouter un nouveau propriétaire
  useEffect(() => {
    if (searchTerm.length > 0) {
      const exactMatch = owners.find((owner: Owner) => 
        owner.name.toLowerCase() === searchTerm.toLowerCase()
      )
      setShowAddOption(!exactMatch)
    } else {
      setShowAddOption(false)
    }
  }, [searchTerm, owners])

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (ownerName: string) => {
    onChange(ownerName)
    setSearchTerm(ownerName)
    setIsOpen(false)
  }

  const handleAddNew = async () => {
    if (searchTerm.trim()) {
      const newOwner = searchTerm.trim()
      
      try {
        // Créer le nouveau propriétaire en base de données
        const response = await fetch('/api/owners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newOwner }),
        })

        if (response.ok) {
          const newOwnerData = await response.json()
          
          // Mettre à jour la liste locale avec le nouveau propriétaire
          setOwners(prevOwners => {
            const exists = prevOwners.find(owner => 
              owner.name.toLowerCase() === newOwner.toLowerCase()
            )
            if (!exists) {
              return [newOwnerData, ...prevOwners]
            }
            return prevOwners
          })
          
          onChange(newOwner)
          setSearchTerm(newOwner)
          setIsOpen(false)
        } else {
          const errorData = await response.json()
          console.error('Erreur lors de la création du propriétaire:', errorData.error)
          alert(`Erreur: ${errorData.error}`)
        }
      } catch (error) {
        console.error('Erreur lors de la création du propriétaire:', error)
        alert('Erreur lors de la création du propriétaire')
      }
    }
  }

  const handleClear = () => {
    onChange('')
    setSearchTerm('')
    setIsOpen(false)
  }

  const filteredOwners = owners.filter(owner =>
    owner.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-white mr-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-white"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="px-3 py-2 text-gray-400 text-sm">
              Chargement...
            </div>
          ) : (
            <>
              {filteredOwners.map((owner) => (
                <button
                  key={owner.name}
                  type="button"
                  onClick={() => handleSelect(owner.name)}
                  className="w-full px-3 py-2 text-left text-white hover:bg-gray-600 flex items-center justify-between"
                >
                  <span>{owner.name}</span>
                  <span className="text-xs text-gray-400">
                    {owner.count} véhicule{owner.count > 1 ? 's' : ''}
                  </span>
                </button>
              ))}
              
              {showAddOption && (
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="w-full px-3 py-2 text-left text-blue-400 hover:bg-gray-600 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter "{searchTerm}"
                </button>
              )}
              
              {filteredOwners.length === 0 && !showAddOption && searchTerm.length > 0 && (
                <div className="px-3 py-2 text-gray-400 text-sm">
                  Aucun propriétaire trouvé
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
