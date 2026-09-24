package com.classpal.alunos.listarBaixas;

import java.time.OffsetDateTime;

public record ListarBaixasItemResponse(
		Long id,
		Long idAluno,
		String alunoNome,
		OffsetDateTime baixaEm
) {
}
