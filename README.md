# Cinema Prompt Studio

Director console for generating photoreal image prompts — set the rig, copy the shot.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

Output goes to `dist/`. The build uses relative paths (`base: './'`) so it works hosted at any subpath, including GitHub Pages.

## Preview production build

```bash
npm run preview
```

## Deploy

Push to `main` → GitHub Actions builds and deploys automatically.

Live URL: `https://sefruitlifeid-arch.github.io/cinema-prompt-studio/`

To enable for the first time:
1. Go to **Settings → Pages** in the GitHub repo
2. Set **Source** to **GitHub Actions**
3. Push any commit to `main` to trigger the first deploy
