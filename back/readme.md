## Backend (ExpressJS)

To migrate the DB, please run:

```bash
npx prisma migrate dev --name init
```

It may be necessary to reset the database if there is an issue (most likely a compatibility issue).

To reset the database, please run:

```bash
npx prisma migrate reset
```

To generate the Prisma client, please run:

```bash
npx prisma generate
```

To start the server, please run:

```bash
npm install
npx ts-node app.ts
```

Then go to the site: http://localhost:3000/

## Endpoints Summary (API)

* Base URL: `http://localhost:3000/api`
* All endpoints return JSON.
* Routes marked as "Auth" require authentication (token via cookie if configured).

### Auth

* POST `/auth/signup`: user registration.
* POST `/auth/login`: login (returns the session token).
* POST `/auth/logout`: logout. Auth required.
* GET `/auth/me`: information about the currently logged-in user. Auth required.

### Users

* GET `/users`: list users.
* GET `/users/:id`: get a user by ID.
* PATCH `/users/:id`: update a user. Auth + owner required.
* DELETE `/users/:id`: delete a user. Auth + owner required.
* POST `/users/:id/profile-photo`: upload a profile photo. Auth + owner required. Expected: multipart/form-data with `photo` field.
* DELETE `/users/:id/profile-photo`: delete the profile photo. Auth + owner required.

### Flatshares

* GET `/flatshares`: list/search flatshares.
* GET `/flatshares/:id`: get a flatshare by ID.
* GET `/flatshares/:id/members`: list members of a flatshare.
* GET `/flatshares/:id/photos`: list photos of a flatshare.
* POST `/flatshares`: create a flatshare. Auth required.
* PATCH `/flatshares/:id`: update a flatshare. Auth + member required.
* DELETE `/flatshares/:id`: delete a flatshare. Auth + member required.
* POST `/flatshares/:id/photos`: add a photo to the flatshare. Auth + member required. Expected: multipart/form-data with `photo` field.
* DELETE `/flatshares/:id/photos/:photoId`: delete a photo. Auth + member required.
* PATCH `/flatshares/:id/photos/:photoId/position`: update a photo position. Auth + member required.
* POST `/flatshares/:id/applications`: apply to a flatshare. Auth required.
* GET `/flatshares/:id/applications`: list applications for a flatshare. Auth required.
* PATCH `/flatshares/:id/applications/:applicationId/accept`: accept an application. Auth required.
* PATCH `/flatshares/:id/applications/:applicationId/reject`: reject an application. Auth required.
* GET `/flatshares/user/applications`: list applications of the current user. Auth required.

### Static Files (uploads)

* GET `/uploads/...`: access uploaded files (profile photos and flatshare photos).

## Environment Variables

DB_USER=user
DB_PASSWORD=chaton123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=colocaton
