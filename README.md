# ClassPal

Controle de alunos e aulas disponíveis para professores.

## Estrutura

| Peça | Pasta / schema | Porta |
|------|----------------|-------|
| Front | `classpal-web` | 5173 |
| API (monólito) | `classpal-api` ↔ schema `classpal` | 8080 |

## Pré-requisitos

- Java 23+ (`export JAVA_HOME=...` se necessário)
- Node.js 20+ e pnpm
- PostgreSQL local
- Conta Gmail com [App Password](https://myaccount.google.com/apppasswords) (2FA ativo)

Se o JDK estiver em `~/.jdks/jdk-23`:

```bash
export JAVA_HOME="$HOME/.jdks/jdk-23"
export PATH="$JAVA_HOME/bin:$PATH"
```

## Banco de dados

Crie o banco (Flyway cria o schema `classpal` e as tabelas na subida da API):

```bash
createdb classpal
```

Se você ainda tem dados nos schemas legados `usuarios` / `alunos`, pode copiar com:

```bash
psql -U postgres -d classpal -f sql/migrate-legacy-to-classpal.sql
```

(rode isso **depois** da primeira subida do monólito, quando as tabelas `classpal.*` já existirem)

## Gmail SMTP

```bash
export MAIL_USERNAME=seu-email@gmail.com
export MAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx   # App Password, não a senha da conta
```

Opcional:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/classpal
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
```

## Subir

```bash
# Terminal 1 — API
cd classpal-api
./gradlew bootRun

# Terminal 2 — web
cd classpal-web
pnpm install
pnpm dev
```

Abra http://localhost:5173

## Fluxo

1. Cadastro com email → UUID chega no Gmail
2. Login colando o UUID → cookie `classpal_access`
3. Home → Gerenciar aulas → planilha com debounce e “Dar baixa” (agora ou data/hora)
4. Home → Histórico de baixas → filtros por nome/datas e paginação

## Testes

```bash
cd classpal-api
./gradlew test
```

## Deploy (Render + Docker)

A API sobe com multi-stage Docker (`classpal-api/Dockerfile`). Blueprint opcional: `render.yaml` na raiz.

1. Crie um Postgres (ex.: Neon) e monte `DB_URL` no formato JDBC com `sslmode=require` e `currentSchema=classpal`.
2. No Render: **Web Service** → repo GitHub → **Docker**.
   - Root Directory: `classpal-api`
   - Ou use **Blueprint** apontando para `render.yaml`.
3. Environment variables no painel:

| Variável | Exemplo |
|----------|---------|
| `DB_URL` | `jdbc:postgresql://…/neondb?sslmode=require&currentSchema=classpal` |
| `DB_USERNAME` | user do Neon |
| `DB_PASSWORD` | senha |
| `MAIL_USERNAME` | Gmail |
| `MAIL_PASSWORD` | App Password |
| `CORS_ORIGINS` | URL do front (Cloudflare Pages / Vercel), sem barra final |

4. Health check: `GET /health` → `{"status":"ok"}`.
5. Free tier hiberna após ociosidade; cold start é esperado.

Build local (opcional):

```bash
cd classpal-api
docker build -t classpal-api .
docker run --rm -p 8080:8080 \
  -e DB_URL=… -e DB_USERNAME=… -e DB_PASSWORD=… \
  -e MAIL_USERNAME=… -e MAIL_PASSWORD=… \
  -e CORS_ORIGINS=http://localhost:5173 \
  classpal-api
```
