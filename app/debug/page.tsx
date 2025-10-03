export const dynamic = 'force-dynamic'

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">🔍 Debug - Variables d'Environnement</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Variables d'Environnement :</h2>
          <ul className="space-y-2">
            <li>
              <strong>NEXTAUTH_URL:</strong> {process.env.NEXTAUTH_URL || '✅ Auto-détectée (Vercel)'}
            </li>
            <li>
              <strong>NEXTAUTH_SECRET:</strong> {process.env.NEXTAUTH_SECRET ? '✅ Définie' : '❌ Non définie'}
            </li>
            <li>
              <strong>DATABASE_URL:</strong> {process.env.DATABASE_URL ? '✅ Définie' : '❌ Non définie'}
            </li>
            <li>
              <strong>URL Actuelle:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Test de Connexion à la Base de Données :</h2>
          <p className="text-sm text-gray-300">
            Vérifiez les logs Vercel pour voir si la connexion à MongoDB fonctionne.
          </p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Identifiants de Test :</h2>
          <ul className="space-y-1">
            <li><strong>Email:</strong> admin@mdt-hp.com</li>
            <li><strong>Mot de passe:</strong> admin123</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
