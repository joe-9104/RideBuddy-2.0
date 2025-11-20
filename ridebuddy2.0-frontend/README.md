# Cahier des Charges – Projet RideBuddy 2.0

## Titre du projet

*RideBuddy – Plateforme de Gestion de Covoiturage en Temps Réel*

---

## Objectif général

Développer une palteforme web basée sur *Angular + Firebase*, permettant aux utilisateurs de créer, rechercher, réserver et gérer des trajets de covoiturage.

---

## Technologies

* Angular 20
* TypeScript
* Firebase (Authentication, Firestore, Storage)
* Vite

---

## Description fonctionnelle

### 1\. Authentification

* Inscription avec email + mot de passe
* Connexion via Firebase Auth
* Réinitialisation du mot de passe
* Persistance de la session
* Gestion des erreurs Firebase

---

### 2\. Gestion des chauffeurs (Drivers)

* Création et édition d’un chauffeur
* Suppression
* Page détails
* Association du chauffeur à un utilisateur
* Validation du profil (CIN, permis)

---

### 3\. Gestion des trajets (Rides)

* Création d’un trajet (ville départ, ville arrivée, prix, date/heure, places)
* Recherche dynamique (ville, date, driver)
* Filtres : prix, disponibilité, distance
* Affichage de la liste des trajets
* Page détails
* Réservation de places

---

### 4\. Réservations

* Réservation d’une place par utilisateur
* Gestion des places disponibles
* Annulation de réservation
* Historique de l’utilisateur
* Règles métiers (pas d’annulation après l’heure du trajet, etc.)

---

### 5\. Dashboard administratif

* Nombre total d’utilisateurs
* Total chauffeurs
* Total trajets
* Trajets actifs / expirés
* Statistiques dynamiques
* Graphiques et indicateurs

---

## Exigences UI/UX

* Messages d’erreur et validation clairs
* UX fluide
* Mode sombre (optionnel)
