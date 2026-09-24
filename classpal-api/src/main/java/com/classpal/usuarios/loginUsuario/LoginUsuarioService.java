package com.classpal.usuarios.loginUsuario;

import com.classpal.domain.Usuario;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginUsuarioService {

	private final LoginUsuarioRepository loginUsuarioRepository;

	@Transactional(readOnly = true)
	public LoginUsuarioResponse login(UUID uuidAcesso) {
		Usuario usuario = loginUsuarioRepository.findByUuidAcesso(uuidAcesso)
				.orElseThrow(() -> {
					log.warn("Login failed: invalid uuid");
					return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Código de acesso inválido");
				});
		log.info("Login ok usuarioId={}", usuario.getId());
		return new LoginUsuarioResponse(usuario.getId(), usuario.getNome(), usuario.getEmail());
	}
}
