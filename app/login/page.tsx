"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("Tentative de connexion avec:", { email, password: "***" })

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      console.log("Résultat de signIn:", result)

      if (result?.error) {
        console.error("Erreur d'authentification:", result.error)
        setError("Email ou mot de passe incorrect")
      } else if (result?.ok) {
        console.log("Connexion réussie, redirection vers /dashboard")
        router.push("/dashboard")
      } else {
        console.error("Résultat inattendu:", result)
        setError("Erreur de connexion inattendue")
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      setError("Une erreur est survenue lors de la connexion")
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
      
      // Test d'authentification si on a des credentials
      if (email && password) {
        const authResponse = await fetch('/api/test-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        const authResult = await authResponse.json()
        
        info += `Authentification: ${authResult.success ? '✅ OK' : '❌ Erreur'}\n`
        if (!authResult.success) {
          info += `Erreur auth: ${authResult.error}\n`
        }
      }
      
      setDebugInfo(info)
    } catch (error) {
      setDebugInfo(`Erreur de diagnostic: ${error}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            Connexion
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Accédez à votre tableau de bord
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

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

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion en cours...
                </div>
              ) : (
                "Se connecter"
              )}
            </button>
            <button
              type="button"
              onClick={runDiagnostic}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              🔧
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
