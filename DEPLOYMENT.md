# 🚀 Guide de Déploiement Vercel

Ce guide vous explique comment déployer votre système MDT-HP sur Vercel avec SQLite.

## 📋 Prérequis

- ✅ Compte Vercel (gratuit)
- ✅ Repository Git (GitHub, GitLab, ou Bitbucket)
- ✅ Code du projet prêt

## 🔧 Étape 1 : Préparation du projet

### 1.1 Vérifier la configuration

Assurez-vous que votre projet est prêt :

```bash
cd mdt-hp

# Vérifier que tout fonctionne localement
npm run dev
```

### 1.2 Créer le fichier .env.local

Créez un fichier `.env.local` dans le dossier `mdt-hp` :

```env
# Database (SQLite)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-key-super-securise-ici"
```

### 1.3 Tester la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer la base de données
npm run db:push

# Peupler avec des données d'exemple
npm run db:seed
```

## 🌐 Étape 2 : Déploiement sur Vercel

### 2.1 Méthode 1 : Via l'interface Vercel (Recommandée)

1. **Aller sur [vercel.com](https://vercel.com)**
2. **Se connecter** avec GitHub/GitLab/Bitbucket
3. **Cliquer sur "New Project"**
4. **Importer votre repository** MDT-HP
5. **Configurer le projet** :
   - Framework Preset : **Next.js**
   - Root Directory : `mdt-hp` (si votre repo contient le dossier)
   - Build Command : `npm run build`
   - Output Directory : `.next`

### 2.2 Méthode 2 : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer
cd mdt-hp
vercel

# Déployer en production
vercel --prod
```

## ⚙️ Étape 3 : Configuration des variables d'environnement

Dans le dashboard Vercel :

1. **Aller dans Settings > Environment Variables**
2. **Ajouter les variables suivantes** :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `DATABASE_URL` | `file:./dev.db` | Base de données SQLite |
| `NEXTAUTH_URL` | `https://votre-app.vercel.app` | URL de votre app |
| `NEXTAUTH_SECRET` | `votre-secret-super-securise` | Clé secrète NextAuth |

### 3.1 Générer une clé secrète sécurisée

```bash
# Option 1 : Avec OpenSSL
openssl rand -base64 32

# Option 2 : Avec Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3 : En ligne
# https://generate-secret.vercel.app/32
```

## 🗄️ Étape 4 : Configuration de la base de données

### 4.1 SQLite sur Vercel

Avec SQLite, la base de données est créée automatiquement ! Aucune configuration supplémentaire n'est nécessaire.

### 4.2 Peupler la base de données

Après le déploiement, vous pouvez exécuter le script de seed :

```bash
# Via Vercel CLI
vercel env pull .env.local
npm run db:push
npm run db:seed
```

## 🔄 Étape 5 : Redéploiement

Après avoir configuré les variables d'environnement :

1. **Aller dans Deployments**
2. **Cliquer sur "Redeploy"** sur le dernier déploiement
3. **Attendre la fin du build**

## ✅ Étape 6 : Vérification

### 6.1 Tester l'application

1. **Ouvrir l'URL** de votre application Vercel
2. **Vérifier la redirection** vers `/login`
3. **Se connecter** avec :
   - Email : `admin@mdt-hp.com`
   - Mot de passe : `admin123`

### 6.2 Vérifier les fonctionnalités

- ✅ Page de connexion
- ✅ Dashboard principal
- ✅ Liste des véhicules
- ✅ Gestion des groupuscules
- ✅ Gestion des utilisateurs

## 🛠️ Dépannage

### Problème : Erreur de base de données

```bash
# Vérifier les logs Vercel
vercel logs

# Redéployer
vercel --prod
```

### Problème : Variables d'environnement

1. **Vérifier** que toutes les variables sont définies
2. **Redéployer** après modification
3. **Attendre** quelques minutes pour la propagation

### Problème : Build échoue

```bash
# Tester localement
npm run build

# Vérifier les erreurs TypeScript
npx tsc --noEmit
```

## 📊 Monitoring

### Vercel Analytics

1. **Aller dans Analytics** dans le dashboard Vercel
2. **Activer** Vercel Analytics pour suivre les performances

### Logs

```bash
# Voir les logs en temps réel
vercel logs --follow

# Logs d'une fonction spécifique
vercel logs --function=api/vehicles
```

## 🔒 Sécurité

### Bonnes pratiques

1. **Changer** le mot de passe admin par défaut
2. **Utiliser** des clés secrètes fortes
3. **Activer** HTTPS (automatique avec Vercel)
4. **Limiter** l'accès aux API si nécessaire

### Mise à jour des identifiants

```bash
# Créer un nouvel utilisateur admin
npm run db:seed

# Ou modifier directement en base
# (via une interface d'administration)
```

## 🎉 Félicitations !

Votre système MDT-HP est maintenant déployé sur Vercel ! 

### Liens utiles

- **Dashboard Vercel** : https://vercel.com/dashboard
- **Documentation Vercel** : https://vercel.com/docs
- **Support Vercel** : https://vercel.com/help

### Prochaines étapes

1. **Configurer** un nom de domaine personnalisé
2. **Ajouter** des fonctionnalités supplémentaires
3. **Configurer** des sauvegardes automatiques
4. **Monitorer** les performances

---

**Besoin d'aide ?** Consultez la documentation Vercel ou créez une issue sur GitHub.
