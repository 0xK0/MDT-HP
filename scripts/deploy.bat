@echo off
REM Script de déploiement automatisé pour Vercel (Windows)
REM Usage: scripts\deploy.bat

echo 🚀 Déploiement MDT-HP sur Vercel
echo =================================

REM Vérifier que nous sommes dans le bon répertoire
if not exist "package.json" (
    echo ❌ Erreur: Ce script doit être exécuté depuis la racine du projet
    pause
    exit /b 1
)

REM Vérifier que Vercel CLI est installé
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installation de Vercel CLI...
    npm install -g vercel
)

REM Vérifier la connexion Vercel
echo 🔐 Vérification de la connexion Vercel...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo 🔑 Connexion à Vercel...
    vercel login
)

REM Générer le client Prisma
echo 🔧 Génération du client Prisma...
call npm run db:generate

REM Build du projet
echo 🏗️  Build du projet...
call npm run build

if errorlevel 1 (
    echo ❌ Erreur lors du build. Arrêt du déploiement.
    pause
    exit /b 1
)

REM Déploiement
echo 🚀 Déploiement sur Vercel...
call vercel --prod

if errorlevel 1 (
    echo ❌ Erreur lors du déploiement
    pause
    exit /b 1
) else (
    echo ✅ Déploiement réussi !
    echo.
    echo 📋 Prochaines étapes :
    echo 1. Configurer les variables d'environnement dans Vercel
    echo 2. Redéployer pour appliquer les variables
    echo 3. Tester l'application
    echo.
    echo 🔗 Variables à configurer :
    echo - DATABASE_URL: file:./dev.db
    echo - NEXTAUTH_URL: https://votre-app.vercel.app
    echo - NEXTAUTH_SECRET: [générer une clé sécurisée]
)

pause
