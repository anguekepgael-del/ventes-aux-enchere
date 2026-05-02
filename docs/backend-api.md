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
| Categories | `GET /api/categories`, `POST /api/categories`, `GET /api/categories/:id`, `PATCH /api/categories/:id` |
| Villes | `GET /api/cities`, `POST /api/cities`, `GET /api/cities/:id`, `PATCH /api/cities/:id` |
| Documents | `GET /api/documents`, `POST /api/documents`, `GET /api/documents/:id`, `PATCH /api/documents/:id/review` |
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

## Source de donnees

Le backend accepte deux modes :

```bash
BACKEND_DATA_SOURCE=memory
BACKEND_DATA_SOURCE=prisma
```

`memory` garde les donnees de demonstration en memoire pour developper vite.
`prisma` utilise PostgreSQL via Prisma. Pour activer ce mode, fournir `DATABASE_URL`, lancer `npm run db:push`, puis demarrer le backend.

## Etat actuel

Les services `users`, `sellers`, `buyers`, `categories`, `cities`, `documents`, `auctions`, `payments`, `disputes` et `notifications` savent deja basculer vers Prisma quand `BACKEND_DATA_SOURCE=prisma`. Les prochaines migrations prioritaires concernent les remboursements/reversements avances, les regles anti-fraude et les logs d'audit.
