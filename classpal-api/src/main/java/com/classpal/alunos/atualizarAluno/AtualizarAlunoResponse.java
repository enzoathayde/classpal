package com.classpal.alunos.atualizarAluno;

public record AtualizarAlunoResponse(
		Long id,
		String nome,
		Integer aulasDisponiveis,
		Long vinculo
) {
}
