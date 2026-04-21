import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  site: 'https://lemonochrome.fr',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
  vite: {
    plugins: [
      {
        name: 'public-directory-index',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url?.split('?')[0] ?? '';
            if (url.endsWith('/')) {
              const filePath = path.join(process.cwd(), 'public', url, 'index.html');
              if (fs.existsSync(filePath)) {
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
                return;
              }
            }
            next();
          });
        },
      },
    ],
  },
});
