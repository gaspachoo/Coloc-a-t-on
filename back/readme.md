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

To-Do:

- Instead of sending the token in the body, store it in a cookie (httpOnly, secure, sameSite)
- Add refresh token mechanism
