package com.classpal.alunos.registrarAluno;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegistrarAlunoRequest(
		@NotBlank String nome,
		@NotNull @Min(0) Integer aulasDisponiveis
) {
}
