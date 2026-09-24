package com.classpal.usuarios.cadastrarUsuario;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class CadastrarUsuarioController {

	private final CadastrarUsuarioService cadastrarUsuarioService;

	@PostMapping("/cadastro")
	public ResponseEntity<CadastrarUsuarioResponse> cadastro(@Valid @RequestBody CadastrarUsuarioRequest request) {
		log.debug("POST /api/usuarios/cadastro");
		CadastrarUsuarioResponse body = cadastrarUsuarioService.cadastrar(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(body);
	}
}
