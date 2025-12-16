## Backend (ExpressJS)

To migrate DB, please type:

```bash
 npx prisma migrate dev --name init
```

It way be required to reset the database if there is an issue (more probably compatibility issue).

To reset the database, please type:

```bash
 npx prisma migrate reset
```

To generate prisma client, please type:

```bash
npx prisma generate
```

To launch the server please type:

```bash
npm install
npx ts-node app.ts
```

Aller ensuite sur le site : http://localhost:3000/

## Résumé des endpoints (API)

- Base URL: `http://localhost:3000/api`
- Tous les endpoints renvoient du JSON.
- Les routes marquées "Auth" nécessitent une authentification (token via cookie si configuré).

### Auth

- POST `/auth/signup` : inscription d'un utilisateur.
- POST `/auth/login` : connexion (retourne le token de session).
- POST `/auth/logout` : déconnexion. Auth requis.
- GET `/auth/me` : informations de l'utilisateur connecté. Auth requis.

### Users

- GET `/users` : lister les utilisateurs.
- GET `/users/:id` : récupérer un utilisateur par ID.
- PATCH `/users/:id` : mettre à jour un utilisateur. Auth + propriétaire requis.
- DELETE `/users/:id` : supprimer un utilisateur. Auth + propriétaire requis.
- POST `/users/:id/profile-photo` : téléverser la photo de profil. Auth + propriétaire requis. Attendu: multipart/form-data avec champ `photo`.
- DELETE `/users/:id/profile-photo` : supprimer la photo de profil. Auth + propriétaire requis.

### Flatshares

- GET `/flatshares` : lister/rechercher les colocations.
- GET `/flatshares/:id` : récupérer une colocation par ID.
- GET `/flatshares/:id/members` : lister les membres d'une colocation.
- GET `/flatshares/:id/photos` : lister les photos d'une colocation.
- POST `/flatshares` : créer une colocation. Auth requis.
- PATCH `/flatshares/:id` : mettre à jour une colocation. Auth + membre requis.
- DELETE `/flatshares/:id` : supprimer une colocation. Auth + membre requis.
- POST `/flatshares/:id/photos` : ajouter une photo à la colocation. Auth + membre requis. Attendu: multipart/form-data avec champ `photo`.
- DELETE `/flatshares/:id/photos/:photoId` : supprimer une photo. Auth + membre requis.
- PATCH `/flatshares/:id/photos/:photoId/position` : mettre à jour la position d'une photo. Auth + membre requis.
- POST `/flatshares/:id/applications` : candidater à une colocation. Auth requis.
- GET `/flatshares/:id/applications` : lister les candidatures d'une colocation. Auth requis.
- PATCH `/flatshares/:id/applications/:applicationId/accept` : accepter une candidature. Auth requis.
- PATCH `/flatshares/:id/applications/:applicationId/reject` : rejeter une candidature. Auth requis.
- GET `/flatshares/user/applications` : lister les candidatures de l'utilisateur courant. Auth requis.

### Fichiers statiques (uploads)

- GET `/uploads/...` : accès aux fichiers téléversés (photos de profil et de colocation).

## Variables d'environnement

DB_USER=user
DB_PASSWORD=chaton123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=colocaton
