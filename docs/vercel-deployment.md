# Deploiement Vercel

## Methode recommandee

1. Aller sur Vercel.
2. Cliquer `Add New...` puis `Project`.
3. Importer le depot GitHub `anguekepgael-del/ventes-aux-enchere`.
4. Laisser Vercel detecter Next.js.
5. Framework preset: Next.js.
6. Build command: `npm run build`.
7. Output directory: laisser vide.
8. Ajouter les variables de `.env.example` selon l'environnement.
9. Deployer.

## Secrets GitHub Actions optionnels

Pour utiliser `.github/workflows/vercel-production.yml`, ajouter dans GitHub:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Ces valeurs se recuperent apres liaison du projet Vercel.

## Domaines

1. Ajouter `enchere.cm` dans Vercel Project Settings > Domains.
2. Copier les records DNS demandes par Vercel.
3. Les recreer dans Cloudflare.
4. Verifier le domaine dans Vercel.
5. Laisser Cloudflare en `Full strict`.

## Limitation actuelle

La machine locale ne contient pas `npm`, `pnpm`, `yarn`, `git`, `gh` ou `vercel`. Le build et le deploy doivent donc etre faits par Vercel via GitHub ou par une machine qui dispose de Node/npm et de la CLI Vercel.
