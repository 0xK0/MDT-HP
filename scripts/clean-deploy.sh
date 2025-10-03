#!/bin/bash

echo "🧹 Nettoyage complet du cache..."

# Supprimer le cache Prisma
rm -rf node_modules/.prisma

# Supprimer le cache Next.js
rm -rf .next

# Supprimer le cache npm
rm -rf node_modules

# Réinstaller les dépendances
echo "📦 Réinstallation des dépendances..."
npm install

# Régénérer le client Prisma
echo "🔧 Régénération du client Prisma..."
npm run db:generate

# Build
echo "🏗️ Build de l'application..."
npm run build

echo "✅ Nettoyage et build terminés!"
