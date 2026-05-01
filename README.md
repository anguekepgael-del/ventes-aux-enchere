# Enchere.cm

Application principale Next.js d'une plateforme camerounaise d'encheres en ligne securisees.

## Objectif

Construire une base evolutive et deployable sur Vercel, protegee par Cloudflare et prete pour PostgreSQL, stockage S3 compatible, paiements Mobile Money et service temps reel externe.

## Fonctionnalites

- Accueil premium mobile-first.
- Catalogue d'encheres avec categories prioritaires.
- Parcours de confiance: vendeur verifie, bien inspecte, caution et paiement securise.
- Back-office administrateur pour validations, paiements, signalements et litiges.
- Architecture cible pour PostgreSQL, stockage prive, Mobile Money et temps reel.

## Commandes

```bash
npm install
npm run dev
npm run build
node tests/marketplace-core.test.mjs
```

La version legacy autonome reste dans `index.html`, mais l'application principale est maintenant dans `app/`.

## Deploiement

- Vercel: voir `docs/vercel-deployment.md`.
- Cloudflare: voir `docs/cloudflare-vercel-security.md`.
- Architecture scalable: voir `docs/scalable-production-architecture.md`.
- Cadrage V1: voir `docs/v1-product-architecture.md`.
