package com.classpal.usuarios.obterMe;

import com.classpal.security.AccessUuidResolver;
import com.classpal.security.AuthenticatedUser;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class ObterMeController {

	private final ObterMeService obterMeService;
	private final AccessUuidResolver accessUuidResolver;

	@GetMapping("/me")
	public ObterMeResponse me(HttpServletRequest request) {
		AuthenticatedUser user = accessUuidResolver.requireUser(request);
		return obterMeService.me(user);
	}
}
