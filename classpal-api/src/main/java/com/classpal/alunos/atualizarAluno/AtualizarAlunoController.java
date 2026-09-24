package com.classpal.alunos.atualizarAluno;

import com.classpal.security.AccessUuidResolver;
import com.classpal.security.AuthenticatedUser;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/alunos")
@RequiredArgsConstructor
public class AtualizarAlunoController {

	private final AtualizarAlunoService atualizarAlunoService;
	private final AccessUuidResolver accessUuidResolver;

	@PatchMapping("/{id}")
	public AtualizarAlunoResponse atualizar(
			HttpServletRequest request,
			@PathVariable Long id,
			@RequestBody AtualizarAlunoRequest body
	) {
		AuthenticatedUser user = accessUuidResolver.requireUser(request);
		return atualizarAlunoService.atualizar(user, id, body);
	}
}
