package com.classpal.usuarios.obterMe;

import com.classpal.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ObterMeService {

	public ObterMeResponse me(AuthenticatedUser user) {
		log.debug("obterMe usuarioId={}", user.id());
		return new ObterMeResponse(user.id(), user.nome(), user.email());
	}
}
