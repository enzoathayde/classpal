package com.classpal.alunos.atualizarAluno;

import jakarta.validation.constraints.Min;

public record AtualizarAlunoRequest(
		String nome,
		@Min(0) Integer aulasDisponiveis
) {
}
