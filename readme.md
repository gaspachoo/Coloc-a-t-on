# Colocaton

## Production

Pour la production, il est recommandé d'utiliser Docker pour construire et déployer l'application. Voici les étapes à suivre :

Copier le fichier `.env.example` en `.env` et configurez les variables d'environnement nécessaires.
Copier le fichier `docker-compose.yml` et ajustez les configurations si nécessaire.

Déployer avec :

```bash
docker-compose build
docker-compose up -d
```
