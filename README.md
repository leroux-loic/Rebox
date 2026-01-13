# ReBoX

> **Donnez une seconde vie aux cartons.**
> Une marketplace écologique, économique et locale pour l'échange de cartons entre professionnels et particuliers.

ReBoX est une application web (et compatible mobile via Capacitor) qui facilite la réutilisation des cartons. Conçue comme le "Vinted" ou "Le Bon Coin" du carton, elle permet aux entreprises de se débarrasser de leurs surplus et aux particuliers (ou autres entreprises) de trouver des emballages à moindre coût.

![ReBoX Banner](https://placehold.co/1200x400/008753/white?text=ReBoX+Marketplace)

## 🚀 Fonctionnalités Clés

-   **🔍 Recherche Géolocalisée** : Trouvez des cartons autour de vous grâce à une carte interactive (Leaflet).
-   **👤 Profils Différenciés** :
    -   **Entreprises** : Vendez ou donnez vos lots de cartons, gérez vos annonces.
    -   **Particuliers** : Achetez des lots adaptés à vos besoins (déménagement, envoi).
-   **💳 Paiements Sécurisés** : Intégration complète avec **Stripe** pour les transactions.
-   **🔐 Authentification Robuste** : Inscription et connexion via **Supabase Auth**.
-   **📱 Design Premium & Mobile-First** : Interface soignée utilisant Chakra UI, avec des animations fluides et une UX moderne.
-   **🏆 Gamification** : Système de points, badges (Écolo, Super Vendeur) et classements pour inciter au recyclage.

## 🛠 Stack Technique

-   **Frontend** : [Next.js 14](https://nextjs.org/) (App Router), TypeScript, React.
-   **Styling** : [Chakra UI](https://chakra-ui.com/) + TailwindCSS (pour certaines utilitaires).
-   **Backend & Base de données** : [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage).
-   **Paiement** : [Stripe](https://stripe.com/).
-   **Cartes** : [React Leaflet](https://react-leaflet.js.org/).
-   **Mobile** : [Capacitor](https://capacitorjs.com/) (prêt pour déploiement iOS/Android).

## 🏁 Pour Commencer

### Prérequis

-   Node.js 18+
-   Compte Supabase
-   Compte Stripe (pour les paiements)

### Installation

1.  **Cloner le projet**
    ```bash
    git clone https://github.com/leroux-loic/Rebox.git
    cd Rebox
    ```

2.  **Installer les dépendances**
    ```bash
    npm install
    ```

3.  **Configurer les variables d'environnement**
    Copiez le fichier `.env.example` en `.env` et remplissez les valeurs.
    ```bash
    cp .env.example .env
    ```

4.  **Lancer le serveur de développement**
    ```bash
    npm run dev
    ```
    Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## ⚙️ Configuration Environnement

Voir `.env.example` pour la liste complète des clés requises :
-   `NEXT_PUBLIC_SUPABASE_URL` & `ANON_KEY` : Pour l'API Supabase.
-   `STRAIPE_SECRET_KEY` & `PUBLISHABLE_KEY` : Pour le checkout.
-   `NEXT_PUBLIC_BASE_URL` : URL de l'application (http://localhost:3000 en dev, https://wis.interlumos.fr en prod).

## 📱 Mobile (Capacitor)

Pour synchroniser et lancer sur mobile :

```bash
npm run build
npx cap sync
npx cap open android # ou ios
```

## 🤝 Contribution

Les Pull Requests sont les bienvenues. Pour les changements majeurs, veuillez d'abord ouvrir une issue pour discuter de ce que vous souhaitez changer.

1.  Forkez le projet
2.  Créez votre branche (`git checkout -b feature/AmazingFeature`)
3.  Commitez vos changements (`git commit -m 'Add some AmazingFeature'`)
4.  Pushez vers la branche (`git push origin feature/AmazingFeature`)
5.  Ouvrez une Pull Request

---

Développé avec ❤️ pour l'environnement.
