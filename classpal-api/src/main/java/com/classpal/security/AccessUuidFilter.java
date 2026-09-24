package com.classpal.security;

import com.classpal.domain.Usuario;
import com.classpal.usuarios.obterMe.ObterMeRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 20)
@RequiredArgsConstructor
public class AccessUuidFilter extends OncePerRequestFilter {

	private final AccessUuidResolver accessUuidResolver;
	private final ObterMeRepository obterMeRepository;

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
			return true;
		}
		String path = request.getRequestURI();
		String method = request.getMethod();
		if ("POST".equalsIgnoreCase(method) && "/api/usuarios/cadastro".equals(path)) {
			return true;
		}
		if ("POST".equalsIgnoreCase(method) && "/api/usuarios/login".equals(path)) {
			return true;
		}
		return !requiresAuth(path);
	}

	private static boolean requiresAuth(String path) {
		return path.startsWith("/api/alunos")
				|| path.startsWith("/api/baixas")
				|| path.startsWith("/api/usuarios/me");
	}

	@Override
	protected void doFilterInternal(
			HttpServletRequest request,
			HttpServletResponse response,
			FilterChain filterChain
	) throws ServletException, IOException {
		Optional<UUID> uuidOpt = accessUuidResolver.resolveOptional(request);
		if (uuidOpt.isEmpty()) {
			writeUnauthorized(response, "Código de acesso ausente");
			return;
		}

		Optional<Usuario> usuario = obterMeRepository.findByUuidAcesso(uuidOpt.get());
		if (usuario.isEmpty()) {
			log.warn("Invalid access uuid attempted path={}", request.getRequestURI());
			writeUnauthorized(response, "Código de acesso inválido");
			return;
		}

		Usuario u = usuario.get();
		request.setAttribute(
				AccessUuidResolver.ATTR_USER,
				new AuthenticatedUser(u.getId(), u.getUuidAcesso(), u.getNome(), u.getEmail())
		);
		filterChain.doFilter(request, response);
	}

	private void writeUnauthorized(HttpServletResponse response, String mensagem) throws IOException {
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		response.setCharacterEncoding(StandardCharsets.UTF_8.name());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		String safe = mensagem.replace("\\", "\\\\").replace("\"", "\\\"");
		response.getWriter().write("{\"mensagem\":\"" + safe + "\"}");
	}
}
