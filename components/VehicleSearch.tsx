"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

export function VehicleSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  // Recherche automatique avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams()
      if (searchTerm.trim()) {
        params.set('search', searchTerm.trim())
      }
      router.push(`/dashboard/vehicles?${params.toString()}`)
    }, 500) // Délai de 500ms

    return () => clearTimeout(timeoutId)
  }, [searchTerm, router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // La recherche se fait automatiquement via useEffect
  }

  const clearSearch = () => {
    setSearchTerm('')
    router.push('/dashboard/vehicles')
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <form onSubmit={handleSearch} className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par plaque, nom, groupuscule..."
            className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </button>
      </form>
    </div>
  )
}
