package com.classpal.alunos.listarAlunos;

import com.classpal.security.AccessUuidResolver;
import com.classpal.security.AuthenticatedUser;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/alunos")
@RequiredArgsConstructor
public class ListarAlunosController {

	private final ListarAlunosService listarAlunosService;
	private final AccessUuidResolver accessUuidResolver;

	@GetMapping
	public ListarAlunosPaginaResponse listar(
			HttpServletRequest request,
			@RequestParam(required = false) Integer limit,
			@RequestParam(required = false) Integer offset
	) {
		AuthenticatedUser user = accessUuidResolver.requireUser(request);
		return listarAlunosService.listar(user, limit, offset);
	}
}
