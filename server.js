import fs from 'node:fs/promises';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createServer as createViteServer } from 'vite';
import compression from 'compression';
import sirv from 'sirv';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
export const prisma = new PrismaClient();

// Constants
const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : '';

// Create http server
const app = express();

// Parse JSON bodies
app.use(express.json());

// Import API routes
const apiRouter = (await import('./src/api/index.js')).default;

// API routes
app.use('/api', apiRouter);

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite;

if (!isProduction) {
  vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
} else {
  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: [] }));
}

// Serve HTML
app.use('*', async (req, res, next) => {
  const url = req.originalUrl.replace(base, '');

  try {
    /** @type {string} */
    let template;
    /** @type {import('./src/entry-server.ts').render} */
    let render;
    
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile(join(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
