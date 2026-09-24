const USUARIOS_URL = import.meta.env.VITE_USUARIOS_URL ?? 'http://localhost:8080'
const ALUNOS_URL = import.meta.env.VITE_ALUNOS_URL ?? 'http://localhost:8080'

export type Usuario = {
  id: number
  nome: string
  email: string
}

export type Aluno = {
  id: number
  nome: string
  aulasDisponiveis: number
  vinculo: number
}

export type PaginaAlunos = {
  items: Aluno[]
  total: number
  limit: number
  offset: number
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { mensagem?: string }
    return data.mensagem ?? `Erro ${res.status}`
  } catch {
    return `Erro ${res.status}`
  }
}

async function request<T>(
  base: string,
  path: string,
  init: RequestInit = {},
  accessUuid?: string | null,
): Promise<T> {
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (accessUuid) {
    headers.set('X-Access-Uuid', accessUuid)
  }

  const res = await fetch(`${base}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(await parseError(res))
  }

  if (res.status === 204) {
    return undefined as T
  }

  return (await res.json()) as T
}

export const usuariosApi = {
  cadastro(email: string) {
    return request<{ mensagem: string }>(USUARIOS_URL, '/api/usuarios/cadastro', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },
  login(uuidAcesso: string) {
    return request<Usuario>(USUARIOS_URL, '/api/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({ uuidAcesso }),
    })
  },
  me(accessUuid: string) {
    return request<Usuario>(USUARIOS_URL, '/api/usuarios/me', { method: 'GET' }, accessUuid)
  },
}

export const alunosApi = {
  listar(accessUuid: string, params: { limit?: number; offset?: number } = {}) {
    const qs = new URLSearchParams()
    if (params.limit != null) qs.set('limit', String(params.limit))
    if (params.offset != null) qs.set('offset', String(params.offset))
    const query = qs.toString()
    return request<PaginaAlunos>(
      ALUNOS_URL,
      `/api/alunos${query ? `?${query}` : ''}`,
      { method: 'GET' },
      accessUuid,
    )
  },
  criar(accessUuid: string, nome: string, aulasDisponiveis: number) {
    return request<Aluno>(
      ALUNOS_URL,
      '/api/alunos',
      {
        method: 'POST',
        body: JSON.stringify({ nome, aulasDisponiveis }),
      },
      accessUuid,
    )
  },
  atualizar(
    accessUuid: string,
    id: number,
    patch: { nome?: string; aulasDisponiveis?: number },
  ) {
    return request<Aluno>(
      ALUNOS_URL,
      `/api/alunos/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(patch),
      },
      accessUuid,
    )
  },
  darBaixa(accessUuid: string, id: number, baixaEm: string) {
    return request<Aluno>(
      ALUNOS_URL,
      `/api/alunos/${id}/dar-baixa`,
      {
        method: 'POST',
        body: JSON.stringify({ baixaEm }),
      },
      accessUuid,
    )
  },
}

export type BaixaItem = {
  id: number
  idAluno: number
  alunoNome: string
  baixaEm: string
}

export type PaginaBaixas = {
  items: BaixaItem[]
  total: number
  limit: number
  offset: number
}

export const baixasApi = {
  listar(
    accessUuid: string,
    params: {
      nome?: string
      de?: string
      ate?: string
      limit?: number
      offset?: number
    } = {},
  ) {
    const qs = new URLSearchParams()
    if (params.nome) qs.set('nome', params.nome)
    if (params.de) qs.set('de', params.de)
    if (params.ate) qs.set('ate', params.ate)
    if (params.limit != null) qs.set('limit', String(params.limit))
    if (params.offset != null) qs.set('offset', String(params.offset))
    const query = qs.toString()
    return request<PaginaBaixas>(
      ALUNOS_URL,
      `/api/baixas${query ? `?${query}` : ''}`,
      { method: 'GET' },
      accessUuid,
    )
  },
}
