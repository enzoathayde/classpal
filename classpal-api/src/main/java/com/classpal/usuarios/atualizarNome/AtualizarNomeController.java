package com.classpal.usuarios.atualizarNome;

import com.classpal.security.AccessUuidResolver;
import com.classpal.security.AuthenticatedUser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class AtualizarNomeController {

	private final AtualizarNomeService atualizarNomeService;
	private final AccessUuidResolver accessUuidResolver;

	@PatchMapping("/me")
	public AtualizarNomeResponse atualizar(HttpServletRequest request, @Valid @RequestBody AtualizarNomeRequest body) {
		AuthenticatedUser user = accessUuidResolver.requireUser(request);
		return atualizarNomeService.atualizar(user, body);
	}
}
