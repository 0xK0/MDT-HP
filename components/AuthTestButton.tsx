"use client"

export function AuthTestButton() {
  const handleTestAuth = async () => {
    try {
      const response = await fetch('/api/test-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@mdt-hp.com',
          password: 'admin123'
        })
      })
      const result = await response.json()
      alert(JSON.stringify(result, null, 2))
    } catch (error) {
      alert('Erreur: ' + error)
    }
  }

  return (
    <button 
      onClick={handleTestAuth}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      Tester l'Authentification
    </button>
  )
}
