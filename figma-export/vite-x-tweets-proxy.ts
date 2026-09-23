import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

const REPO_ROOT = path.resolve(__dirname, '..')

function loadRootEnv() {
  const envPath = path.join(REPO_ROOT, '.env')
  if (!fs.existsSync(envPath)) return

  const content = fs.readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separator = trimmed.indexOf('=')
    if (separator === -1) continue

    const key = trimmed.slice(0, separator).trim()
    let value = trimmed.slice(separator + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

/** Dev-only: serve `/api/x/tweets` using repo-root `.env` bearer token (no separate :8080 process). */
export function xTweetsDevProxy(): Plugin {
  return {
    name: 'x-tweets-dev-proxy',
    apply: 'serve',
    configureServer(server) {
      loadRootEnv()

      server.middlewares.use((req, res, next) => {
        const url = req.url ?? ''
        if (req.method !== 'GET' || !url.startsWith('/api/x/tweets')) {
          next()
          return
        }

        void (async () => {
          const { getXBearerToken } = await import('../lib/x-env.mjs')
          const { fetchXTweetsForUsername } = await import('../lib/x-api.mjs')

          const parsed = new URL(url, 'http://127.0.0.1')
          const username = String(parsed.searchParams.get('username') || '')
            .replace(/^@/, '')
            .trim()
          const maxResults = Number.parseInt(String(parsed.searchParams.get('max_results') || '10'), 10)
          const bearerToken = getXBearerToken()

          const sendJson = (status: number, payload: unknown) => {
            res.statusCode = status
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.end(JSON.stringify(payload))
          }

          if (!username) {
            sendJson(400, { error: 'username is required' })
            return
          }

          if (!bearerToken) {
            sendJson(503, { error: 'X API not configured', tweets: [] })
            return
          }

          try {
            const tweets = await fetchXTweetsForUsername(username, {
              maxResults: Number.isNaN(maxResults) ? 10 : maxResults,
              bearerToken,
            })
            sendJson(200, tweets)
          } catch (error) {
            sendJson(502, {
              error: 'X API request failed',
              message: error instanceof Error ? error.message : 'Unknown error',
              tweets: [],
            })
          }
        })().catch(next)
      })
    },
  }
}
