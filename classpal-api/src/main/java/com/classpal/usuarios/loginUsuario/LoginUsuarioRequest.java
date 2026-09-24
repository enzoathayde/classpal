package com.classpal.usuarios.loginUsuario;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record LoginUsuarioRequest(
		@NotNull UUID uuidAcesso
) {
}
