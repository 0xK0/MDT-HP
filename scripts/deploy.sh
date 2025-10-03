#!/bin/bash

# Script de déploiement automatisé pour Vercel
# Usage: ./scripts/deploy.sh

echo "🚀 Déploiement MDT-HP sur Vercel"
echo "================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis la racine du projet"
    exit 1
fi

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

# Vérifier la connexion Vercel
echo "🔐 Vérification de la connexion Vercel..."
if ! vercel whoami &> /dev/null; then
    echo "🔑 Connexion à Vercel..."
    vercel login
fi

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npm run db:generate

# Build du projet
echo "🏗️  Build du projet..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build. Arrêt du déploiement."
    exit 1
fi

# Déploiement
echo "🚀 Déploiement sur Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi !"
    echo ""
    echo "📋 Prochaines étapes :"
    echo "1. Configurer les variables d'environnement dans Vercel"
    echo "2. Redéployer pour appliquer les variables"
    echo "3. Tester l'application"
    echo ""
    echo "🔗 Variables à configurer :"
    echo "- DATABASE_URL: file:./dev.db"
    echo "- NEXTAUTH_URL: https://votre-app.vercel.app"
    echo "- NEXTAUTH_SECRET: [générer une clé sécurisée]"
else
    echo "❌ Erreur lors du déploiement"
    exit 1
fi
