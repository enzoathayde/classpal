package com.classpal.alunos.registrarAluno;

public record RegistrarAlunoResponse(
		Long id,
		String nome,
		Integer aulasDisponiveis,
		Long vinculo
) {
}
