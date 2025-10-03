"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Eye } from 'lucide-react'
import { ConfirmDialog } from './ConfirmDialog'

interface ActionButtonsProps {
  id: string
  type: 'user' | 'groupuscule' | 'vehicle' | 'vehicle-type'
  userRole?: 'ADMIN' | 'USER'
  onEdit?: () => void
  onView?: () => void
}

export function ActionButtons({ id, type, userRole = 'USER', onEdit, onView }: ActionButtonsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const router = useRouter()

  const handleDeleteClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    setShowConfirmDialog(false)
    
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

  const handleCancelDelete = () => {
    setShowConfirmDialog(false)
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
      {userRole === 'ADMIN' && (
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="text-red-400 hover:text-red-300 disabled:opacity-50"
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
      
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        isLoading={isDeleting}
      />
    </div>
  )
}
