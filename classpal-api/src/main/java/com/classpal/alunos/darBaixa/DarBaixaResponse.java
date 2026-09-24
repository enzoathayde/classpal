package com.classpal.alunos.darBaixa;

public record DarBaixaResponse(
		Long id,
		String nome,
		Integer aulasDisponiveis,
		Long vinculo
) {
}
