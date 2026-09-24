package com.classpal.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class AccessUuidResolver {

	public static final String COOKIE_NAME = "classpal_access";
	public static final String HEADER_NAME = "X-Access-Uuid";
	public static final String ATTR_USER = "classpal.authenticatedUser";

	public Optional<UUID> resolveOptional(HttpServletRequest request) {
		String header = request.getHeader(HEADER_NAME);
		if (header != null && !header.isBlank()) {
			return parse(header.trim());
		}
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (COOKIE_NAME.equals(cookie.getName()) && cookie.getValue() != null && !cookie.getValue().isBlank()) {
					return parse(cookie.getValue().trim());
				}
			}
		}
		return Optional.empty();
	}

	public UUID requireUuid(HttpServletRequest request) {
		return resolveOptional(request)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Código de acesso ausente"));
	}

	public AuthenticatedUser requireUser(HttpServletRequest request) {
		Object attr = request.getAttribute(ATTR_USER);
		if (attr instanceof AuthenticatedUser user) {
			return user;
		}
		throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Código de acesso inválido");
	}

	private static Optional<UUID> parse(String raw) {
		try {
			return Optional.of(UUID.fromString(raw));
		}
		catch (IllegalArgumentException ex) {
			return Optional.empty();
		}
	}
}
