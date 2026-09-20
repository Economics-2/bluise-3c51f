[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/gomah/bluise)

# Bluise - A Nuxt.js & Netlify CMS boilerplate.

I wanted to explore Netlify CMS & Tailwind CSS, ended up creating this boilerplate.

So far we've got:

- Blog w/ posts, including pagination.
- Configurable manifest & global settings.
- CSS Markdown (Thanks to [https://github.com/iandinwoodie/github-markdown-tailwindcss/blob/master/markdown.css]).
- Dynamic pages.
- PWA ready.
- SEO ready for posts & pages.
- Signup form (using Netlify Forms).
- Tools (Commitlint, Husky).
- Typescript.
- Tests (Jest + Vue Test Utils).

## Quickstart

### Prerequisites

- [Node.js](https://nodejs.org/en/) 17+
- [npm](https://www.npmjs.com/) (bundled with Node)

```bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev

# build for production with minification
npm run generate

# run all tests (lint + unit)
npm test
```

> **Note on Node compatibility.** The modern Node.js runtime (v17+)
> requires the `--openssl-legacy-provider` flag for Webpack 4 and has
> breaking changes for the legacy `esm` loader used by Nuxt 2.13. Both are
> handled automatically: the npm scripts pass the required flag, and a
> `postinstall` script (`scripts/postinstall-patch.js`) patches
> `@nuxt/config` to load `nuxt.config.ts` with `jiti` instead of `esm`.

### Using Netlify CMS

1. Deploy to Netlify.
2. Enable Identity under Settings.
3. Configure registration preferences & external providers if needed.
4. Enable Git Gateway.

_Note: You'll need to specify the Netlify URL when browsing the admin page locally._
