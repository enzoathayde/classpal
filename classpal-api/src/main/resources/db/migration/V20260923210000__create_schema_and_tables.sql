-- ClassPal monolith: single schema
CREATE SCHEMA IF NOT EXISTS classpal;

CREATE TABLE IF NOT EXISTS classpal.usuario (
    id              BIGSERIAL PRIMARY KEY,
    uuid_acesso     UUID NOT NULL UNIQUE,
    nome            TEXT NOT NULL,
    email           TEXT NOT NULL UNIQUE,
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuario_uuid_acesso ON classpal.usuario (uuid_acesso);
CREATE INDEX IF NOT EXISTS idx_usuario_email ON classpal.usuario (email);

CREATE TABLE IF NOT EXISTS classpal.aluno (
    id                  BIGSERIAL PRIMARY KEY,
    nome                TEXT NOT NULL,
    aulas_disponiveis   INT NOT NULL DEFAULT 0 CHECK (aulas_disponiveis >= 0),
    vinculo             BIGINT NOT NULL,
    criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aluno_vinculo ON classpal.aluno (vinculo);

CREATE TABLE IF NOT EXISTS classpal.baixa (
    id              BIGSERIAL PRIMARY KEY,
    id_aluno        BIGINT NOT NULL REFERENCES classpal.aluno(id),
    baixa_em        TIMESTAMPTZ NOT NULL,
    id_professor    UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_baixa_id_professor ON classpal.baixa (id_professor);
CREATE INDEX IF NOT EXISTS idx_baixa_baixa_em ON classpal.baixa (baixa_em);
CREATE INDEX IF NOT EXISTS idx_baixa_id_aluno ON classpal.baixa (id_aluno);
