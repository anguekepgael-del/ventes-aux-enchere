# Cloudflare + Vercel security runbook

## Objectif

Cloudflare protege le domaine public, gere le DNS, applique les controles WAF/DDoS/CDN et envoie le trafic vers Vercel. Vercel heberge l'application Next.js et gere les deployments issus de GitHub.

## DNS

1. Ajouter le domaine dans Cloudflare.
2. Changer les nameservers chez le registrar vers ceux fournis par Cloudflare.
3. Dans Cloudflare DNS, creer les enregistrements fournis par Vercel.
4. Les records de verification Vercel restent en `DNS only` si Vercel le demande.
5. Mettre les records web publics en mode proxied quand Cloudflare peut proxyfier le type de record.

## SSL/TLS

- Mode SSL/TLS: Full strict.
- Activer Always Use HTTPS.
- Activer Automatic HTTPS Rewrites.
- Verifier que Vercel sert bien un certificat valide pour le domaine.

## WAF et DDoS

- DDoS HTTP et reseau: protection Cloudflare active par defaut.
- Activer Cloudflare Managed Ruleset.
- Activer OWASP Core Ruleset en mode log puis challenge/block apres observation.
- Bloquer les methodes HTTP non utilisees.
- Bloquer `x-middleware-subrequest` par defense en profondeur.
- Appliquer rate limiting sur `/api/auth/*`, `/api/bids/*`, `/api/payments/*` et `/api/webhooks/*`.

## Regles recommandees

### Bloquer methodes inutiles

```text
not http.request.method in {"GET" "HEAD" "POST" "OPTIONS"}
```

Action: Block.

### Proteger Next.js contre les contournements connus

```text
http.request.headers["x-middleware-subrequest"][0] ne ""
```

Action: Block.

### Rate limit enchere

```text
starts_with(http.request.uri.path, "/api/bids")
```

Action: Managed Challenge ou Block selon seuil.

## CDN et cache

- Laisser Vercel optimiser Next.js.
- Cloudflare protege et accelere surtout les assets statiques.
- Ne pas cacher les pages authentifiees, les API d'enchere, les paiements ou les webhooks.
- Cacher les images publiques validees, assets statiques versionnes et pages marketing publiques.

## Observabilite

- Activer Cloudflare Web Analytics.
- Activer Vercel Analytics et Speed Insights.
- Configurer Logpush Cloudflare vers un stockage securise quand le trafic devient significatif.
- Surveiller WAF events, pics 4xx/5xx, latence `/api/bids`, erreurs webhooks Mobile Money et tentatives OTP.
