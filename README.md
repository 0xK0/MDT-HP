# MDT-HP - Système de Gestion des Véhicules

Un système complet de gestion des véhicules avec authentification, gestion des groupuscules et des utilisateurs.

## Fonctionnalités

- 🔐 **Authentification sécurisée** avec NextAuth.js
- 🚗 **Gestion des véhicules** avec enregistrement complet
- 🏢 **Gestion des groupuscules** et organisations
- 👥 **Gestion des utilisateurs** avec rôles (Admin/User)
- 📊 **Tableau de bord** avec statistiques
- 🎨 **Interface moderne** avec Tailwind CSS
- 🚀 **Déploiement Vercel** prêt

## Structure des données

### Véhicules
- Modèle du véhicule
- Plaque d'immatriculation
- Nom du propriétaire
- N° de rapport associé
- Appartenance (Groupuscule)

### Groupuscules
- Nom
- Description (optionnel)

### Utilisateurs
- Nom complet
- Email
- Mot de passe (hashé)
- Rôle (ADMIN/USER)

## Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd mdt-hp
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer la base de données**
```bash
# Créer un fichier .env.local avec vos variables d'environnement
cp .env.example .env.local
```

4. **Configurer Prisma**
```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers la base de données
npm run db:push

# Peupler la base de données avec des données d'exemple
npm run db:seed
```

5. **Démarrer le serveur de développement**
```bash
npm run dev
```

## Configuration de la base de données

### Variables d'environnement (.env.local)

```env
# Database (SQLite)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-key-ici"
```

### Base de données MongoDB

Le projet utilise MongoDB avec Prisma ORM. MongoDB est :
- ✅ **Cloud** : Base de données hébergée dans le cloud
- ✅ **Scalable** : Parfait pour la production
- ✅ **Fiable** : Haute disponibilité et sauvegarde automatique
- ✅ **Compatible Vercel** : Fonctionne parfaitement en production

### Scripts Disponibles

```bash
# Développement
npm run dev

# Base de données
npm run db:generate  # Générer le client Prisma
npm run db:push      # Appliquer le schéma à MongoDB
npm run db:seed      # Peupler la base de données

# Déploiement
npm run deploy       # Déployer sur Vercel
npm run deploy:auto  # Build et déployer automatiquement
```

## Déploiement sur Vercel

1. **Connecter votre repository à Vercel**

2. **Configurer les variables d'environnement dans Vercel :**
   - `DATABASE_URL` : URL de connexion MongoDB (ex: `mongodb+srv://user:pass@cluster.mongodb.net/mdt-hp`)
   - `NEXTAUTH_URL` : URL de votre application Vercel
   - `NEXTAUTH_SECRET` : Clé secrète pour NextAuth

3. **Déployer**
```bash
vercel --prod
```

4. **Configurer la base de données en production**
```bash
# Après le déploiement, exécuter les migrations
npx prisma db push

# Peupler avec des données d'exemple (optionnel)
npm run db:seed
```

> **Note** : Avec SQLite, la base de données est créée automatiquement lors du premier déploiement. Aucune configuration supplémentaire n'est nécessaire !

## Utilisation

### Connexion par défaut
- **Email** : admin@mdt-hp.com
- **Mot de passe** : admin123

### Navigation
- **Dashboard** : Vue d'ensemble avec statistiques
- **Véhicules** : Liste et gestion des véhicules
- **Groupuscules** : Gestion des organisations
- **Utilisateurs** : Gestion des comptes utilisateurs

## Technologies utilisées

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Prisma** - ORM pour la base de données
- **NextAuth.js** - Authentification
- **SQLite** - Base de données
- **Vercel** - Déploiement

## Structure du projet

```
mdt-hp/
├── app/
│   ├── api/                 # API Routes
│   ├── dashboard/           # Pages du dashboard
│   ├── login/              # Page de connexion
│   └── layout.tsx          # Layout principal
├── lib/
│   ├── auth.ts             # Configuration NextAuth
│   └── prisma.ts           # Client Prisma
├── prisma/
│   └── schema.prisma       # Schéma de base de données
├── scripts/
│   └── seed.ts             # Script de données d'exemple
└── types/
    └── next-auth.d.ts      # Types NextAuth
```

## Développement

### Ajouter de nouvelles fonctionnalités

1. **Modifier le schéma Prisma** si nécessaire
2. **Créer les API routes** dans `app/api/`
3. **Créer les composants** dans `app/dashboard/`
4. **Mettre à jour les types** si nécessaire

### Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run start` - Serveur de production
- `npm run db:generate` - Générer le client Prisma
- `npm run db:push` - Pousser le schéma vers la DB
- `npm run db:seed` - Peupler la base de données

## Support

Pour toute question ou problème, consultez la documentation ou créez une issue.