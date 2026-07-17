# Publish with GitHub Pages

1. Create a public GitHub repository.
2. Open this folder in VS Code.
3. Run:

```bash
git init
git add .
git commit -m "Publish FitVerse fitness app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

4. On GitHub open `Settings → Pages`.
5. Set Source to `GitHub Actions`.
6. Open the Actions tab and wait for the deployment workflow to finish.

The included Vite configuration uses relative asset paths, so it works under a GitHub Pages repository subpath.
