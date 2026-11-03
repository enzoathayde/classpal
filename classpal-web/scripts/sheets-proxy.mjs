/**
 * Local proxy for VITE_API_BACKEND=sheets.
 * Reads APPS_SCRIPT_URL + APPS_SCRIPT_SECRET from .env.local
 */
import http from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const envPath = resolve(root, '.env.local')

function loadEnv() {
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const i = trimmed.indexOf('=')
    if (i < 0) continue
    const key = trimmed.slice(0, i).trim()
    let val = trimmed.slice(i + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnv()

const PORT = Number(process.env.SHEETS_PROXY_PORT || 8787)
const scriptUrl = process.env.APPS_SCRIPT_URL
const appSecret = process.env.APPS_SCRIPT_SECRET

if (!scriptUrl || !appSecret) {
  console.error(
    'Missing APPS_SCRIPT_URL or APPS_SCRIPT_SECRET in classpal-web/.env.local',
  )
  process.exit(1)
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (!chunks.length) return null
  const raw = Buffer.concat(chunks).toString('utf8')
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Access-Uuid')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  try {
    const url = new URL(req.url || '/', `http://127.0.0.1:${PORT}`)
    if (url.pathname === '/health' || url.pathname === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 'ok', proxy: true }))
      return
    }

    const query = {}
    for (const [k, v] of url.searchParams.entries()) query[k] = v

    const body =
      req.method === 'GET' || req.method === 'HEAD' ? null : await readBody(req)

    const upstream = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: req.method || 'GET',
        path: url.pathname,
        query,
        accessUuid: req.headers['x-access-uuid'] || null,
        appSecret,
        body,
      }),
      redirect: 'follow',
    })

    const text = await upstream.text()
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          mensagem: 'Resposta inválida do Apps Script',
          detalhe: text.slice(0, 300),
        }),
      )
      return
    }

    const status = typeof parsed.status === 'number' ? parsed.status : 502
    res.writeHead(status, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(parsed.data ?? { mensagem: 'Erro' }))
  } catch (err) {
    res.writeHead(502, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        mensagem: 'Falha no proxy local',
        detalhe: err instanceof Error ? err.message : String(err),
      }),
    )
  }
})

server.listen(PORT, () => {
  console.log(`Sheets proxy on http://127.0.0.1:${PORT}`)
})
