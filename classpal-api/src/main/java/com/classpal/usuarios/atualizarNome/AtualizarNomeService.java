package com.classpal.usuarios.atualizarNome;

import com.classpal.domain.Usuario;
import com.classpal.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Service
@RequiredArgsConstructor
public class AtualizarNomeService {

	private final AtualizarNomeRepository atualizarNomeRepository;

	@Transactional
	public AtualizarNomeResponse atualizar(AuthenticatedUser auth, AtualizarNomeRequest request) {
		Usuario usuario = atualizarNomeRepository.findByUuidAcesso(auth.uuidAcesso())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Código de acesso inválido"));
		usuario.setNome(request.nome().trim());
		log.info("Nome atualizado usuarioId={}", usuario.getId());
		return new AtualizarNomeResponse(usuario.getId(), usuario.getNome(), usuario.getEmail());
	}
}
