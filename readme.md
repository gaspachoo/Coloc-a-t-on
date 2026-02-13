# Colocaton

Application de recherche et gestion de colocations pour les étudiants de Centrale Méditerranée.

## 🚀 Démarrage rapide

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et démarré
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

   #Application Configuration
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
   A exécuter la première fois pour build l'image

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```

   A exécuter pour mettre en route le docker

   **En mode production** :
   A venir

4. **Accéder à l'application**
   - Frontend : http://localhost:5173
   - Backend API : http://localhost:5000
   - PostgreSQL : localhost:5432

### Commandes utiles

```bash
# Voir les logs en temps réel
docker logs -f colocaton-backend   # Backend
docker logs -f colocaton-frontend  # Frontend
docker logs -f colocaton-postgres  # Base de données

# Arrêter l'application
docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# Reconstruire les images
docker compose -f docker-compose.yml -f docker-compose.dev.yml build

# Démarrer les services
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Réinitialiser complètement (⚠️ supprime les données)
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
```

## 📁 Structure du projet

```
Colocaton/
├── front/              # Application React + Vite
│   ├── src/
│   │   ├── components/ # Composants React
│   │   ├── pages/      # Pages de l'application
│   │   └── context/    # Context API (Auth, UI)
│   └── Dockerfile
├── back/               # API Node.js + Express + Prisma
│   ├── controllers/    # Contrôleurs Express
│   ├── services/       # Logique métier
│   ├── repositories/   # Accès aux données
│   ├── routes/         # Routes API
│   ├── prisma/         # Schéma et migrations Prisma
│   └── Dockerfile
├── docker-compose.yml      # Configuration production
├── docker-compose.dev.yml  # Configuration développement
└── .env                    # Variables d'environnement (à créer)
```

## 🛠️ Développement

### Backend

Le backend utilise :

- **Node.js** avec Express
- **TypeScript** avec hot-reload via `tsx`
- **Prisma** comme ORM (PostgreSQL)
- **bcryptjs** pour le hachage des mots de passe
- **Multer** pour l'upload de fichiers

Les changements de code sont automatiquement détectés grâce au volume Docker et `tsx`.

### Frontend

Le frontend utilise :

- **React 19** avec TypeScript
- **Vite** comme bundler
- **React Router** pour la navigation
- **Leaflet** pour les cartes
- **Lucide React** pour les icônes

Le hot-reload est activé automatiquement via Vite.

### Migrations de base de données

Les migrations Prisma s'exécutent automatiquement au démarrage du backend.

Pour créer une nouvelle migration manuellement :

```bash
docker exec colocaton-backend npx prisma migrate dev --name nom_de_la_migration
```

## 📝 API Endpoints

### Authentication

- `POST /api/auth/signup` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur

### Flatshares (Colocations)

- `GET /api/flatshares` - Liste des colocations
- `POST /api/flatshares` - Créer une colocation
- `GET /api/flatshares/:id` - Détails d'une colocation
- `PUT /api/flatshares/:id` - Modifier une colocation
- `DELETE /api/flatshares/:id` - Supprimer une colocation
- `POST /api/flatshares/:id/photos` - Ajouter des photos

### Applications

- `GET /api/flatshares/:id/applications` - Liste des candidatures
- `POST /api/flatshares/:id/applications` - Candidater
- `POST /api/flatshares/:id/applications/:applicationId/accept` - Accepter
- `POST /api/flatshares/:id/applications/:applicationId/reject` - Refuser

## 👥 Contributeurs

Projet réalisé dans le cadre du Projet 3A à Centrale Méditerranée.

## 📄 Licence

Ce projet est à usage académique uniquement.
