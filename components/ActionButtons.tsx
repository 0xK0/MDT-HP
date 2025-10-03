"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Eye } from 'lucide-react'

interface ActionButtonsProps {
  id: string
  type: 'user' | 'groupuscule' | 'vehicle' | 'vehicle-type'
  onEdit?: () => void
  onView?: () => void
}

export function ActionButtons({ id, type, onEdit, onView }: ActionButtonsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      return
    }

    setIsDeleting(true)
    try {
      const apiPath = type === 'vehicle-type' ? 'vehicle-types' : `${type}s`
      const response = await fetch(`/api/${apiPath}/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.refresh()
      } else {
        const error = await response.json()
        alert('Erreur: ' + error.error)
      }
    } catch (error) {
      alert('Erreur lors de la suppression')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit()
    } else {
      const editPath = type === 'vehicle-type' ? 'vehicle-types' : `${type}s`
      router.push(`/dashboard/${editPath}/${id}/edit`)
    }
  }

  const handleView = () => {
    if (onView) {
      onView()
    } else {
      const viewPath = type === 'vehicle-type' ? 'vehicle-types' : `${type}s`
      router.push(`/dashboard/${viewPath}/${id}`)
    }
  }

  return (
    <div className="flex space-x-2">
      {onView && (
        <button
          onClick={handleView}
          className="text-blue-400 hover:text-blue-300"
          title="Voir"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}
      <button
        onClick={handleEdit}
        className="text-yellow-400 hover:text-yellow-300"
        title="Modifier"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-400 hover:text-red-300 disabled:opacity-50"
        title="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
