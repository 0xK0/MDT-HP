"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PinKeypad } from "@/components/PinKeypad"

export default function LoginPage() {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")
  const router = useRouter()

  const handlePinEnter = (newPin: string) => {
    setPin(newPin)
    setError("")
  }

  const handleClear = () => {
    setPin("")
    setError("")
  }

  const handleBackspace = () => {
    setPin(pin.slice(0, -1))
    setError("")
  }

  const handleSubmit = async () => {
    if (pin.length < 4) {
      setError("Code PIN trop court")
      return
    }

    setLoading(true)
    setError("")

    console.log("Tentative de connexion avec le code PIN:", pin)

    try {
      const response = await fetch('/api/auth-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: pin }),
      })

      const result = await response.json()
      console.log("Résultat de l'authentification PIN:", result)

      if (result.success) {
        console.log("Connexion réussie avec le code PIN:", result.user)
        // Stocker les informations de session localement
        localStorage.setItem('user', JSON.stringify(result.user))
        router.push("/dashboard")
      } else {
        console.error("Erreur d'authentification PIN:", result.error)
        setError(result.error || "Code PIN incorrect")
        setPin("")
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      setError("Une erreur est survenue lors de la connexion")
      setPin("")
    } finally {
      setLoading(false)
    }
  }

  const runDiagnostic = async () => {
    setDebugInfo("Exécution des diagnostics...")
    
    try {
      // Test de connexion à la base de données
      const dbResponse = await fetch('/api/test-db')
      const dbResult = await dbResponse.json()
      
      let info = `Base de données: ${dbResult.success ? '✅ OK' : '❌ Erreur'}\n`
      if (dbResult.success) {
        info += `Utilisateurs en base: ${dbResult.userCount}\n`
      } else {
        info += `Erreur DB: ${dbResult.error}\n`
      }
      
      // Test d'authentification PIN si on a un code
      if (pin) {
        const authResponse = await fetch('/api/auth-pin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: pin })
        })
        const authResult = await authResponse.json()
        
        info += `Authentification PIN: ${authResult.success ? '✅ OK' : '❌ Erreur'}\n`
        if (!authResult.success) {
          info += `Erreur auth: ${authResult.error}\n`
        }
      }
      
      setDebugInfo(info)
    } catch (error) {
      setDebugInfo(`Erreur de diagnostic: ${error}`)
    }
  }

  // Auto-submit quand le PIN atteint 6 caractères
  if (pin.length === 6 && !loading) {
    handleSubmit()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            Connexion
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Entrez votre code PIN
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {debugInfo && (
            <div className="bg-gray-800 p-3 rounded-md text-xs text-gray-300 whitespace-pre-line">
              {debugInfo}
            </div>
          )}

          <PinKeypad
            onPinEnter={handlePinEnter}
            onClear={handleClear}
            onBackspace={handleBackspace}
            pin={pin}
            maxLength={6}
          />

          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="mt-2 text-sm text-gray-400">Vérification du code...</p>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={runDiagnostic}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              🔧 Diagnostic
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
