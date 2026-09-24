package com.classpal.alunos.listarBaixas;

import java.util.List;

public record ListarBaixasResponse(
		List<ListarBaixasItemResponse> items,
		long total,
		int limit,
		int offset
) {
}
