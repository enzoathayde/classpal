import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const scriptUrl = process.env.APPS_SCRIPT_URL
  const appSecret = process.env.APPS_SCRIPT_SECRET

  if (!scriptUrl || !appSecret) {
    res.status(200).json({ status: 'ok', sheets: 'not_configured' })
    return
  }

  try {
    const upstream = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'GET',
        path: '/health',
        query: {},
        accessUuid: null,
        appSecret,
        body: null,
      }),
      redirect: 'follow',
    })
    const parsed = (await upstream.json()) as { status?: number }
    res.status(200).json({
      status: 'ok',
      sheets: parsed.status === 200 ? 'up' : 'degraded',
    })
  } catch {
    res.status(200).json({ status: 'ok', sheets: 'down' })
  }
}
