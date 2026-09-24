package com.classpal.alunos.listarAlunos;

import java.util.List;

public record ListarAlunosPaginaResponse(
		List<ListarAlunosResponse> items,
		long total,
		int limit,
		int offset
) {
}
