package com.classpal.usuarios.atualizarNome;

import jakarta.validation.constraints.NotBlank;

public record AtualizarNomeRequest(
		@NotBlank String nome
) {
}
