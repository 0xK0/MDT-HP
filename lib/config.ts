export const getNextAuthUrl = () => {
  // En production, utiliser l'URL de Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // En développement, utiliser localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  
  // Fallback
  return process.env.NEXTAUTH_URL || 'http://localhost:3000'
}

export const config = {
  nextAuthUrl: getNextAuthUrl(),
  databaseUrl: process.env.DATABASE_URL!,
  nextAuthSecret: process.env.NEXTAUTH_SECRET!,
}
