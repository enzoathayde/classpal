package com.classpal.alunos.listarAlunos;

public record ListarAlunosResponse(
		Long id,
		String nome,
		Integer aulasDisponiveis,
		Long vinculo
) {
}
