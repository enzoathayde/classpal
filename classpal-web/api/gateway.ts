import type { VercelRequest, VercelResponse } from '@vercel/node'

type ScriptResponse = {
  status?: number
  data?: unknown
}

/** Proxies /api/* → Google Apps Script (via vercel rewrite ?route=...). */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const scriptUrl = process.env.APPS_SCRIPT_URL
  const appSecret = process.env.APPS_SCRIPT_SECRET

  if (!scriptUrl || !appSecret) {
    res.status(500).json({
      mensagem: 'API Sheets não configurada (APPS_SCRIPT_URL / APPS_SCRIPT_SECRET)',
    })
    return
  }

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  const routeParam = req.query.route
  const route = Array.isArray(routeParam) ? routeParam[0] : routeParam
  const apiPath = '/api/' + String(route || '').replace(/^\/+/, '')

  const query: Record<string, string> = {}
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'route' || value == null) continue
    query[key] = Array.isArray(value) ? String(value[0]) : String(value)
  }

  const accessHeader = req.headers['x-access-uuid']
  const accessUuid = Array.isArray(accessHeader)
    ? accessHeader[0] ?? null
    : accessHeader ?? null

  try {
    const upstream = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: req.method ?? 'GET',
        path: apiPath,
        query,
        accessUuid,
        appSecret,
        body: req.body ?? null,
      }),
      redirect: 'follow',
    })

    const text = await upstream.text()
    let parsed: ScriptResponse
    try {
      parsed = JSON.parse(text) as ScriptResponse
    } catch {
      res.status(502).json({
        mensagem: 'Resposta inválida do Apps Script',
        detalhe: text.slice(0, 300),
      })
      return
    }

    res
      .status(typeof parsed.status === 'number' ? parsed.status : 502)
      .json(parsed.data ?? { mensagem: 'Erro' })
  } catch (err) {
    res.status(502).json({
      mensagem: 'Falha ao falar com Apps Script',
      detalhe: err instanceof Error ? err.message : String(err),
    })
  }
}