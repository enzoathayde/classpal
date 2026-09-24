package com.classpal.security;

import java.util.UUID;

public record AuthenticatedUser(
		Long id,
		UUID uuidAcesso,
		String nome,
		String email
) {
}
