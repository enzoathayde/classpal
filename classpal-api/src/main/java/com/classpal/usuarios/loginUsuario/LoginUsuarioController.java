package com.classpal.usuarios.loginUsuario;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class LoginUsuarioController {

	private final LoginUsuarioService loginUsuarioService;

	@PostMapping("/login")
	public LoginUsuarioResponse login(@Valid @RequestBody LoginUsuarioRequest request) {
		log.debug("POST /api/usuarios/login");
		return loginUsuarioService.login(request.uuidAcesso());
	}
}
