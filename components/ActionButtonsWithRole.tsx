"use client"

import { useEffect, useState } from 'react'
import { ActionButtons } from './ActionButtons'

interface ActionButtonsWithRoleProps {
  id: string
  type: 'user' | 'groupuscule' | 'vehicle' | 'vehicle-type'
  onEdit?: () => void
  onView?: () => void
}

export function ActionButtonsWithRole({ id, type, onEdit, onView }: ActionButtonsWithRoleProps) {
  const [userRole, setUserRole] = useState<'ADMIN' | 'USER'>('USER')

  useEffect(() => {
    // Récupérer le rôle de l'utilisateur depuis localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUserRole(userData.role || 'USER')
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error)
        setUserRole('USER')
      }
    }
  }, [])

  return (
    <ActionButtons 
      id={id} 
      type={type} 
      userRole={userRole}
      onEdit={onEdit}
      onView={onView}
    />
  )
}
