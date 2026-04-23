import { createServer as createHttpServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = __dirname;
const distDir = path.join(root, 'dist');
const dataDir = path.join(root, 'server-data');
const stateFile = path.join(dataDir, 'countdown.json');
const countdownDurationMs = 5 * 24 * 60 * 60 * 1000;
const port = Number(process.env.PORT || 5173);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

async function ensureCountdownState() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    const raw = await fs.readFile(stateFile, 'utf8');
    const parsed = JSON.parse(raw);

    if (typeof parsed.launchAt === 'number' && Number.isFinite(parsed.launchAt)) {
      return parsed;
    }
  } catch {
    // Fall through and create a fresh shared launch time.
  }

  const createdAt = Date.now();
  const state = {
    createdAt,
    launchAt: createdAt + countdownDurationMs
  };

  await fs.writeFile(stateFile, JSON.stringify(state, null, 2), 'utf8');
  return state;
}

async function serveCountdownState(res) {
  const state = await ensureCountdownState();
  const payload = JSON.stringify({
    launchAt: state.launchAt,
    serverNow: Date.now()
  });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(payload);
}

async function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const content = await fs.readFile(filePath);

  res.statusCode = 200;
  res.setHeader('Content-Type', contentType);
  res.end(content);
}

async function start() {
  const isProduction =
    process.env.NODE_ENV === 'production' || process.argv.includes('--production');

  if (isProduction) {
    const server = createHttpServer(async (req, res) => {
      const url = new URL(req.url || '/', 'http://localhost');

      if (url.pathname === '/api/countdown') {
        await serveCountdownState(res);
        return;
      }

      const requestedPath = decodeURIComponent(url.pathname);
      const candidatePath = path.resolve(distDir, `.${requestedPath}`);
      const relativePath = path.relative(distDir, candidatePath);

      if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        res.statusCode = 403;
        res.end('Forbidden');
        return;
      }

      try {
        const stat = await fs.stat(candidatePath);
        if (stat.isFile()) {
          await serveStaticFile(res, candidatePath);
          return;
        }
      } catch {
        // Fallback to the SPA shell below.
      }

      await serveStaticFile(res, path.join(distDir, 'index.html'));
    });

    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
    return;
  }

  const vite = await createViteServer({
    appType: 'custom',
    server: {
      middlewareMode: true
    }
  });

  const server = createHttpServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://localhost');

    if (url.pathname === '/api/countdown') {
      await serveCountdownState(res);
      return;
    }

    vite.middlewares(req, res, async () => {
      if (res.writableEnded) {
        return;
      }

      try {
        const template = await fs.readFile(path.join(root, 'index.html'), 'utf8');
        const transformed = await vite.transformIndexHtml(url.pathname, template);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(transformed);
      } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(error instanceof Error ? error.message : 'Server error');
      }
    });
  });

  server.listen(port, () => {
    console.log(`Dev server running at http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
