# Configuration Git et GitHub pour France Pharmacies

## 📋 Étapes à suivre sur votre machine locale

### 1. Télécharger le projet
Téléchargez tous les fichiers du projet depuis Bolt et placez-les dans un dossier local.

### 2. Initialiser Git
```bash
# Aller dans le dossier du projet
cd france-pharmacies

# Initialiser le repository Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: France Pharmacies app with pharmacy finder, trends and news"
```

### 3. Créer un repository sur GitHub

1. Aller sur [GitHub.com](https://github.com)
2. Cliquer sur "New repository"
3. Nom du repository : `france-pharmacies`
4. Description : `Application web pour trouver des pharmacies en France avec tendances médicaments et actualités`
5. Choisir "Public" ou "Private"
6. **NE PAS** cocher "Initialize with README" (on a déjà un README)
7. Cliquer "Create repository"

### 4. Connecter le repository local à GitHub
```bash
# Ajouter l'origine GitHub (remplacer YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/france-pharmacies.git

# Renommer la branche principale en main
git branch -M main

# Pousser le code vers GitHub
git push -u origin main
```

### 5. Vérification
Aller sur votre repository GitHub pour vérifier que tous les fichiers sont bien présents.

## 🔧 Configuration recommandée

### Branches de protection
1. Aller dans Settings > Branches
2. Ajouter une règle pour `main`
3. Cocher "Require pull request reviews before merging"

### GitHub Pages (optionnel)
1. Aller dans Settings > Pages
2. Source : "GitHub Actions"
3. Le site sera disponible sur `https://YOUR_USERNAME.github.io/france-pharmacies`

### Actions GitHub pour CI/CD (optionnel)
Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 📝 Commandes Git utiles

```bash
# Voir le statut
git status

# Ajouter des fichiers modifiés
git add .

# Commit avec message
git commit -m "Description des changements"

# Pousser vers GitHub
git push

# Créer une nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite

# Changer de branche
git checkout main

# Fusionner une branche
git merge feature/nouvelle-fonctionnalite

# Voir l'historique
git log --oneline
```

## 🚀 Après la mise en ligne

1. **Mettre à jour le README** avec l'URL du repository
2. **Ajouter des topics** sur GitHub : `pharmacy`, `france`, `react`, `typescript`, `healthcare`
3. **Créer des issues** pour les futures améliorations
4. **Configurer les notifications** GitHub
5. **Inviter des collaborateurs** si nécessaire

## 🔗 Liens utiles

- [Documentation Git](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [GitHub Pages](https://pages.github.com/)
- [GitHub Actions](https://github.com/features/actions)

---

Une fois ces étapes terminées, votre projet sera disponible sur GitHub ! 🎉