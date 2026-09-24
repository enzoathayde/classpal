package com.classpal.alunos.registrarAluno;

import com.classpal.security.AccessUuidResolver;
import com.classpal.security.AuthenticatedUser;
import jakarta.servlet.http.HttpServletRequest;
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
@RequestMapping("/api/alunos")
@RequiredArgsConstructor
public class RegistrarAlunoController {

	private final RegistrarAlunoService registrarAlunoService;
	private final AccessUuidResolver accessUuidResolver;

	@PostMapping
	public ResponseEntity<RegistrarAlunoResponse> registrar(
			HttpServletRequest request,
			@Valid @RequestBody RegistrarAlunoRequest body
	) {
		AuthenticatedUser user = accessUuidResolver.requireUser(request);
		RegistrarAlunoResponse created = registrarAlunoService.registrar(user, body);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}
}
