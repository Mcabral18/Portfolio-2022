# Marco Cabral — Portfolio

Personal portfolio built with [Astro](https://astro.build) and GSAP. Static output, deployed on Vercel.

## Commands

| Command           | Action                                  |
| :---------------- | :-------------------------------------- |
| `npm install`     | Install dependencies                    |
| `npm run dev`     | Dev server at `http://localhost:4321`   |
| `npm run build`   | Production build to `./dist/`           |
| `npm run preview` | Preview the production build locally    |

## Editing content

All copy lives in `src/data/`:

- `site.ts` — name, roles (hero scramble), social links, nav
- `projects.ts` — featured projects (Selected Work) and the project index
- `expertise.ts` — expertise cards and marquee
- `experience.ts` — timeline entries

## Structure

```
src/
  components/   Section components (.astro, scoped CSS)
  data/         Editable content
  layouts/      Base HTML, SEO meta
  scripts/      sphere.ts (hero canvas), animations.ts (GSAP), scramble.ts
  styles/       global.css (tokens, base, utilities)
```
