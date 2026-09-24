package com.classpal.usuarios.cadastrarUsuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CadastrarUsuarioRequest(
		@NotBlank @Email String email
) {
}
