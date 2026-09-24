package com.classpal.alunos.darBaixa;

import com.classpal.security.AccessUuidResolver;
import com.classpal.security.AuthenticatedUser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/alunos")
@RequiredArgsConstructor
public class DarBaixaController {

	private final DarBaixaService darBaixaService;
	private final AccessUuidResolver accessUuidResolver;

	@PostMapping("/{id}/dar-baixa")
	public DarBaixaResponse darBaixa(
			HttpServletRequest request,
			@PathVariable Long id,
			@Valid @RequestBody DarBaixaRequest body
	) {
		AuthenticatedUser user = accessUuidResolver.requireUser(request);
		return darBaixaService.darBaixa(user, id, body);
	}
}
