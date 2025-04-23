# Rate-me

Application web pour recueillir des avis clients, construite avec React, Vite, Supabase et Material UI.

## ✨ Présentation

Rate-me permet à tout professionnel de générer un formulaire d’avis personnalisé, de collecter les retours clients et d’accéder à un dashboard de gestion. L’application est responsive, PWA-ready, et peut être auto-hébergée ou déployée gratuitement sur Netlify.

---

## ⚡️ Requirements

- **Node.js** v18 ou supérieur recommandé
- **npm** (ou yarn/pnpm)
- **Compte Supabase** (https://supabase.com/)
  - Créez un projet Supabase
  - Récupérez l’URL et la clé anonyme (anon key)

---

## 🚀 Installation

1. **Cloner le dépôt**
   ```bash
   git clone <url-du-repo>
   cd rate-me
   ```

2. **Configurer les variables d’environnement**
   - Copiez `.env-example` en `.env`
   - Renseignez les variables suivantes avec vos valeurs Supabase :
     ```env
     VITE_SUPABASE_URL=...
     VITE_SUPABASE_ANON_KEY=...
     ```

3. **Installer les dépendances**
   ```bash
   npm install
   ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   L’application sera accessible sur http://localhost:5173 (ou le port indiqué).

---

## 🌍 Déploiement sur Netlify

- Poussez votre repo sur GitHub/GitLab
- Connectez Netlify à votre repo
- Ajoutez les variables d’environnement dans les settings Netlify (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- Build command : `npm run build`
- Publish directory : `dist`

---

## 📄 Licence et usage

Ce projet est **libre** : vous pouvez le recopier, le modifier, l’adapter, le réutiliser pour vos propres besoins, sans aucune restriction.

Contributions, suggestions, et forks sont bienvenus !

---

## 💡 Conseils & Astuces

- Pour personnaliser l’apparence, modifiez les fichiers dans `src/pages` et `src/components`.
- Le backend (auth, stockage des avis, users) est géré par Supabase.
- Pour toute question, ouvrez une issue ou contactez le créateur.

---

Bon usage ! 🚀
