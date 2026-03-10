# Colocaton

Application de recherche et gestion de colocations pour les étudiants de Centrale Méditerranée.

## 🚀 Démarrage rapide

### Prérequis

- Docker installé et démarré
- Git

### Installation

1. **Cloner le repository**

   ```bash
   git clone <url-du-repo>
   cd Colocaton
   ```

2. **Configurer les variables d'environnement**

   Copier le fichier `.env.template` en `.env` :

   ```bash
   cp .env.template .env
   ```

   Puis éditer le fichier `.env` avec vos valeurs :

   ```env
   # Database Configuration
   DB_USER=user
   DB_PASSWORD=chaton123
   DB_HOST=db
   DB_PORT=5432
   DB_NAME=colocaton

   # Application Configuration
   NODE_ENV=development
   API_BACKEND_URL=http://localhost:5000/api
   FRONTEND_URL=http://localhost:5173
   CLIENT_PORT=5173
   SERVER_PORT=5000
   ```

   > ⚠️ **Important** : Pour Docker, `DB_HOST` doit être `db` (nom du service dans docker-compose)

3. **Lancer l'application**

   **En mode développement** (avec hot-reload) :

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml build
   ```

   À exécuter dès modification du backend (pas de hot-reload).

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```

   À exécuter pour mettre en route le docker.

   **En mode production** :

   Il est recommandé de faire un pull préalable :
   ```bash
   docker compose pull
   ```

   Puis
   ```bash
   docker compose up -d
   ```
   Attention, concernant le docker-compose de prod, il est conseillé d'utiliser celui disponible sur la branche [prod](https://github.com/gaspachoo/Coloc-a-t-on/tree/prod/)

5. **Accéder à l'application**
   - Frontend : <http://localhost:5173>
   - Backend API : <http://localhost:5000>
   - PostgreSQL : <http://localhost:5432> (en dev uniquement)

### Commandes utiles

```bash
# Voir les logs en temps réel
docker logs -f colocaton-backend   # Backend
docker logs -f colocaton-frontend  # Frontend
docker logs -f colocaton-postgres  # Base de données

# Réinitialiser complètement (⚠️ supprime les données)
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
```

## 📁 Structure du projet

```
Colocaton/
├── front/              # Application React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/       # Modale de connexion/inscription
│   │   │   ├── home/       # Composants de la page d'accueil (carte, filtres, aperçu)
│   │   │   └── layout/     # Navbar, footer, rail gauche, panneau latéral
│   │   ├── pages/          # Pages de l'application
│   │   ├── context/        # Context API (Auth, UI)
│   │   ├── types/          # Types TypeScript partagés
│   │   └── utils/          # Utilitaires (filtres, etc.)
│   └── Dockerfile
├── back/               # API Node.js + Express + Prisma
│   ├── controllers/    # Contrôleurs Express
│   ├── services/       # Logique métier
│   ├── repositories/   # Accès aux données
│   ├── routes/         # Routes API
│   ├── utils/          # Middlewares et utilitaires (auth, upload, image)
│   ├── prisma/         # Schéma et migrations Prisma
│   ├── generated/      # Client Prisma généré
│   ├── uploads/        # Fichiers uploadés (photos, logos)
│   └── Dockerfile
├── docker-compose.yml      # Configuration de base
├── docker-compose.dev.yml  # Surcharge développement (hot-reload)
└── .env                    # Variables d'environnement (à créer)
```

## 🛠️ Développement

### Backend

Le backend utilise :

- **Node.js** avec **Express 5**
- **TypeScript** avec hot-reload via `tsx`
- **Prisma 7** comme ORM (PostgreSQL via adaptateur `pg`)
- **bcryptjs** pour le hachage des mots de passe
- **Multer** pour l'upload de fichiers
- **Sharp** pour le traitement et redimensionnement des images
- **cookie-parser** pour la gestion des cookies (authentification par token httpOnly)

### Frontend

Le frontend utilise :

- **React 19** avec TypeScript
- **Vite** comme bundler
- **React Router v7** pour la navigation
- **Leaflet / React-Leaflet** pour les cartes interactives
- **Lucide React** pour les icônes

Pages disponibles :

- `/` — Page d'accueil avec carte, filtres et liste des colocations
- `/coloc/:colocId` — Détail d'une colocation
- `/coloc/:colocId/edit` — Modification d'une colocation
- `/create-coloc` — Création d'une colocation
- `/profile` — Profil utilisateur

Le hot-reload est activé automatiquement via Vite.

### Modèle de données

Les principales entités de la base de données :

- **User** — Compte utilisateur (nom, prénom, promo, photo de profil, rôle)
- **Flatshare** — Colocation (titre, description, loyer, adresse, géolocalisation, ambiance, statut, logo)
- **FlatshareMember** — Membres d'une colocation (statut : pending, active, scheduled_departure, former)
- **FlatsharePhoto** — Photos associées à une colocation (avec position)
- **FlatshareApplication** — Candidatures (statut : pending, accepted, rejected, cancelled)
- **Favorite** — Colocations favorites d'un utilisateur
- **Equipment / FlatshareEquipment** — Équipements disponibles dans une colocation
- **AuthToken** — Tokens d'authentification (httpOnly cookie)

### Migrations de base de données

Les migrations Prisma s'exécutent automatiquement au démarrage du backend.

Pour créer une nouvelle migration manuellement :

```bash
docker exec colocaton-backend npx prisma migrate dev --name nom_de_la_migration
```

## 📝 API Endpoints

### Authentication

- `POST /api/auth/signup` — Inscription
- `POST /api/auth/login` — Connexion
- `POST /api/auth/logout` — Déconnexion (auth requise)
- `GET /api/auth/me` — Profil de l'utilisateur connecté (auth requise)

### Users (Utilisateurs)

- `GET /api/users` — Liste des utilisateurs
- `GET /api/users/:id` — Détails d'un utilisateur
- `PATCH /api/users/:id` — Modifier son profil (auth requise, propriétaire)
- `DELETE /api/users/:id` — Supprimer son compte (auth requise, propriétaire)
- `POST /api/users/:id/profile-photo` — Uploader une photo de profil (auth requise, propriétaire)
- `DELETE /api/users/:id/profile-photo` — Supprimer la photo de profil (auth requise, propriétaire)
- `POST /api/users/check-roommate-email` — Vérifier l'email d'un colocataire (auth requise)

### Flatshares (Colocations)

- `GET /api/flatshares` — Liste des colocations
- `POST /api/flatshares` — Créer une colocation (auth requise)
- `GET /api/flatshares/:id` — Détails d'une colocation
- `PATCH /api/flatshares/:id` — Modifier une colocation (auth requise, membre)
- `DELETE /api/flatshares/:id` — Supprimer une colocation (auth requise, membre)
- `GET /api/flatshares/:id/members` — Membres de la colocation
- `GET /api/flatshares/:id/photos` — Photos de la colocation
- `GET /api/flatshares/user/flatshares` — Colocations de l'utilisateur connecté (auth requise)

### Photos & Logo

- `POST /api/flatshares/:id/photos` — Ajouter une photo (auth requise, membre)
- `DELETE /api/flatshares/:id/photos/:photoId` — Supprimer une photo (auth requise, membre)
- `PATCH /api/flatshares/:id/photos/:photoId/position` — Modifier la position d'une photo (auth requise, membre)
- `POST /api/flatshares/:id/logo` — Uploader un logo (auth requise, membre)
- `DELETE /api/flatshares/:id/logo` — Supprimer le logo (auth requise, membre)

### Applications (Candidatures)

- `GET /api/flatshares/:id/applications` — Liste des candidatures (auth requise)
- `POST /api/flatshares/:id/applications` — Candidater à une colocation (auth requise)
- `PATCH /api/flatshares/:id/applications/:applicationId/accept` — Accepter une candidature (auth requise)
- `PATCH /api/flatshares/:id/applications/:applicationId/reject` — Refuser une candidature (auth requise)
- `GET /api/flatshares/user/applications` — Candidatures de l'utilisateur connecté (auth requise)

## 👥 Contributeurs

Projet réalisé dans le cadre du Projet 3A à Centrale Méditerranée.

## 📄 Licence

Ce projet est à usage académique uniquement.
