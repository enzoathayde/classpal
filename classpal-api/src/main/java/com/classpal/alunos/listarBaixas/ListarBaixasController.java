package com.classpal.alunos.listarBaixas;

import com.classpal.security.AccessUuidResolver;
import com.classpal.security.AuthenticatedUser;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/baixas")
@RequiredArgsConstructor
public class ListarBaixasController {

	private final ListarBaixasService listarBaixasService;
	private final AccessUuidResolver accessUuidResolver;

	@GetMapping
	public ListarBaixasResponse listar(
			HttpServletRequest request,
			@RequestParam(required = false) String nome,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate de,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ate,
			@RequestParam(required = false) Integer limit,
			@RequestParam(required = false) Integer offset
	) {
		AuthenticatedUser user = accessUuidResolver.requireUser(request);
		return listarBaixasService.listar(user, nome, de, ate, limit, offset);
	}
}
