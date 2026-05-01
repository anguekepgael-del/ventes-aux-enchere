# Enchere.cm - Cadrage V1

## Priorite

La V1 prioritaire est un prototype frontend premium cliquable. Son objectif est de valider la confiance, le parcours mobile, la lisibilite des cautions, la logique d'enchere et le back-office avant d'investir dans l'integration transactionnelle complete.

## Perimetre V1

- Accueil premium rassurant.
- Catalogue d'encheres avec categories prioritaires.
- Page detail de bien avec prix de depart, prix actuel, palier, reserve, caution et achat immediat.
- Simulation de caution avant enchere.
- Depot vendeur en plusieurs etapes.
- Espace acheteur avec cautions, messages, litiges et encheres actives.
- Back-office avec validation biens, vendeurs, paiements, litiges et signalements.
- Support WhatsApp visible.
- Interface responsive mobile-first.

## Architecture cible

- Frontend cible: Next.js, React, TypeScript, Tailwind CSS, Shadcn UI.
- Backend cible: NestJS ou Laravel.
- Base de donnees: PostgreSQL.
- Temps reel: WebSockets ou Socket.io pour les encheres.
- Stockage: S3 compatible pour documents et photos.
- Paiements: Orange Money, MTN MoMo, carte bancaire, virement, paiement manuel valide par admin.
- Securite: HTTPS, OTP, 2FA admin, RBAC, audit logs, anti-fraude, protection XSS/CSRF/SQL injection.

## Roles

- Super administrateur.
- Administrateur.
- Moderateur.
- Agent de verification.
- Support client.
- Finance.
- Vendeur.
- Acheteur.

## Entites principales

- Utilisateur.
- Role et permission.
- Profil vendeur.
- Profil acheteur.
- Document.
- Bien.
- Categorie.
- Enchere.
- Offre.
- Caution.
- Paiement.
- Sequestre.
- Commission.
- Reversement vendeur.
- Remboursement.
- Litige.
- Signalement.
- Notification.
- Ville.
- Livraison ou retrait.
- Facture.

## Regles metier V1

- Un acheteur doit avoir une identite confirmee, un telephone verifie et une caution payee pour encherir.
- Le montant d'une offre doit etre superieur ou egal au prix actuel plus le palier minimum.
- La caution est calculee comme un pourcentage du prix de depart, avec un minimum.
- La commission plateforme est calculee sur le prix final.
- Les biens sensibles, dont l'immobilier, exigent un controle documentaire renforce.

## Migration apres prototype

1. Remplacer les donnees locales par une API.
2. Ajouter authentication email, mot de passe, OTP et 2FA admin.
3. Creer les schemas PostgreSQL et politiques RBAC.
4. Connecter les WebSockets pour les encheres live.
5. Integrer Orange Money et MTN MoMo en mode sandbox.
6. Ajouter sequestre, remboursement, reversement vendeur et facturation.
7. Completer notifications email, SMS et WhatsApp.
