# Enchere.cm

Prototype premium d'une plateforme camerounaise d'encheres en ligne securisees.

## Objectif

Valider rapidement l'experience produit avant la migration vers une architecture complete Next.js, NestJS ou Laravel, PostgreSQL, WebSockets et paiements Mobile Money.

## Fonctionnalites du prototype

- Accueil premium mobile-first.
- Catalogue d'encheres avec filtres par categorie.
- Detail de bien avec prix actuel, palier minimum, reserve, achat immediat et caution.
- Simulation de caution obligatoire avant enchere.
- Espace vendeur avec depot multi-etapes.
- Espace acheteur avec cautions, messages et litiges.
- Back-office avec files de validation, paiements, signalements et litiges.
- Support WhatsApp visible.

## Commandes

```bash
node server.mjs
node tests/marketplace-core.test.mjs
node --check app.js
```

Sans serveur, le prototype peut aussi etre ouvert directement via `index.html`.

## Architecture cible

Voir `docs/v1-product-architecture.md`.
