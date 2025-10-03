# 🍃 Configuration MongoDB pour MDT-HP

## 📋 Prérequis

1. **Compte MongoDB Atlas** (gratuit)
2. **Cluster MongoDB** configuré
3. **Utilisateur de base de données** créé

## 🚀 Étapes de Configuration

### 1. Créer un Compte MongoDB Atlas

1. Allez sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créez un compte gratuit
3. Choisissez le plan **M0 Sandbox** (gratuit)

### 2. Créer un Cluster

1. Cliquez sur **"Build a Database"**
2. Choisissez **"M0 Sandbox"** (gratuit)
3. Sélectionnez une région proche de vous
4. Donnez un nom à votre cluster (ex: `mdt-hp-cluster`)

### 3. Configurer l'Accès

#### A. Créer un Utilisateur de Base de Données

1. Allez dans **"Database Access"**
2. Cliquez sur **"Add New Database User"**
3. Choisissez **"Password"** comme méthode d'authentification
4. Créez un nom d'utilisateur (ex: `mdt-hp-user`)
5. Générez un mot de passe sécurisé
6. Donnez les permissions **"Read and write to any database"**

#### B. Configurer l'Accès Réseau

1. Allez dans **"Network Access"**
2. Cliquez sur **"Add IP Address"**
3. Choisissez **"Allow access from anywhere"** (0.0.0.0/0)
4. Ou ajoutez l'IP de Vercel si vous la connaissez

### 4. Obtenir l'URL de Connexion

1. Allez dans **"Database"**
2. Cliquez sur **"Connect"** sur votre cluster
3. Choisissez **"Connect your application"**
4. Sélectionnez **"Node.js"** et version **"4.1 or later"**
5. Copiez l'URL de connexion

L'URL ressemble à :
```
mongodb+srv://mdt-hp-user:<password>@mdt-hp-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 5. Configurer l'Application

#### A. Variables d'Environnement Locales

Créez un fichier `.env.local` dans le dossier `mdt-hp` :

```env
# MongoDB Configuration
DATABASE_URL="mongodb+srv://mdt-hp-user:VOTRE_MOT_DE_PASSE@mdt-hp-cluster.xxxxx.mongodb.net/mdt-hp?retryWrites=true&w=majority"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="wbYi+ihGzg6vah9P8wUOc39lpY8aSRFl0HBnxsvnlWU="
```

#### B. Variables d'Environnement Vercel

1. Allez dans votre projet Vercel
2. Allez dans **"Settings"** > **"Environment Variables"**
3. Ajoutez :
   - `DATABASE_URL` : Votre URL MongoDB complète
   - `NEXTAUTH_URL` : URL de votre application Vercel
   - `NEXTAUTH_SECRET` : `wbYi+ihGzg6vah9P8wUOc39lpY8aSRFl0HBnxsvnlWU=`

### 6. Initialiser la Base de Données

```bash
# Aller dans le dossier du projet
cd mdt-hp

# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers MongoDB
npm run db:push

# Peupler la base de données
npm run db:seed
```

## 🔧 Commandes Utiles

```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers MongoDB
npm run db:push

# Peupler la base de données
npm run db:seed

# Ouvrir Prisma Studio (interface graphique)
npx prisma studio
```

## 🚨 Dépannage

### Erreur de Connexion

Si vous avez des erreurs de connexion :

1. **Vérifiez l'URL** : Assurez-vous que l'URL est correcte
2. **Vérifiez les permissions** : L'utilisateur doit avoir les bonnes permissions
3. **Vérifiez l'IP** : Votre IP doit être autorisée dans Network Access
4. **Vérifiez le mot de passe** : Le mot de passe ne doit pas contenir de caractères spéciaux non encodés

### Erreur de Schéma

Si vous avez des erreurs de schéma :

1. **Régénérez le client** : `npm run db:generate`
2. **Poussez le schéma** : `npm run db:push`
3. **Vérifiez les types** : Assurez-vous que les types correspondent

## 📊 Avantages de MongoDB

- ✅ **Cloud** : Pas besoin de serveur local
- ✅ **Scalable** : Peut gérer des millions de documents
- ✅ **Fiable** : Sauvegarde automatique et haute disponibilité
- ✅ **Compatible Vercel** : Fonctionne parfaitement en production
- ✅ **Gratuit** : Plan M0 gratuit jusqu'à 512MB

## 🔐 Sécurité

- 🔒 **Utilisez des mots de passe forts**
- 🔒 **Limitez l'accès IP si possible**
- 🔒 **Ne commitez jamais vos credentials**
- 🔒 **Utilisez des variables d'environnement**

## 📞 Support

Si vous avez des problèmes :

1. Vérifiez les logs Vercel
2. Vérifiez les logs MongoDB Atlas
3. Testez la connexion localement
4. Vérifiez les variables d'environnement

---

**Note** : MongoDB Atlas est gratuit jusqu'à 512MB de données, ce qui est largement suffisant pour la plupart des applications.
