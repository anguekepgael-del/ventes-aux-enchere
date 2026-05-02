# Backend API Enchere.cm

Ce backend NestJS expose la premiere base API de la marketplace d'encheres camerounaise.

## Lancement local

```bash
npm install
npm run prisma:generate
npm run backend:build
npm run backend:start
```

Le backend ecoute par defaut sur `http://localhost:4000` avec le prefixe global `/api`.

## Endpoints disponibles

| Domaine | Endpoints |
| --- | --- |
| Sante | `GET /api/health` |
| Utilisateurs | `GET /api/users`, `POST /api/users`, `GET /api/users/:id`, `PATCH /api/users/:id/verification`, `PATCH /api/users/:id/suspend` |
| Vendeurs | `GET /api/sellers`, `POST /api/sellers`, `GET /api/sellers/:id`, `PATCH /api/sellers/:id/review`, `POST /api/sellers/:id/documents/request` |
| Acheteurs | `GET /api/buyers`, `POST /api/buyers`, `GET /api/buyers/:id`, `GET /api/buyers/:id/portfolio` |
| Encheres | `GET /api/auctions`, `POST /api/auctions`, `GET /api/auctions/:id`, `PATCH /api/auctions/:id/review`, `POST /api/auctions/:id/bids`, `POST /api/auctions/:id/buy-now` |
| Paiements | `GET /api/payments`, `POST /api/payments`, `GET /api/payments/:id`, `PATCH /api/payments/:id/status`, `GET /api/payments/escrow/summary` |
| Litiges | `GET /api/disputes`, `POST /api/disputes`, `GET /api/disputes/:id`, `PATCH /api/disputes/:id` |
| Notifications | `GET /api/notifications`, `POST /api/notifications`, `PATCH /api/notifications/:id/sent` |

## Couche PostgreSQL

Le schema Prisma est dans `prisma/schema.prisma`. Il couvre :

- utilisateurs et roles ;
- profils vendeurs et acheteurs ;
- categories et villes ;
- biens aux encheres ;
- offres ;
- paiements et sequestre ;
- documents de verification ;
- litiges ;
- notifications ;
- logs d'audit.

Commandes utiles :

```bash
npm run prisma:validate
npm run prisma:generate
npm run db:push
```

`db:push` demande une variable `DATABASE_URL` valide vers PostgreSQL.

## Etat actuel

Les services utilisent encore un store memoire pour permettre des tests rapides sans base distante. Le module `DatabaseModule` et `PrismaService` sont prets pour migrer progressivement chaque service vers PostgreSQL.
