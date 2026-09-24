package com.classpal.alunos.darBaixa;

import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;

public record DarBaixaRequest(
		@NotNull OffsetDateTime baixaEm
) {
}
