"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté via localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      router.push("/dashboard/vehicles")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-white">Chargement...</div>
    </div>
  )
}
