package com.classpal.usuarios.cadastrarUsuario;

import com.classpal.domain.Usuario;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Service
@RequiredArgsConstructor
public class CadastrarUsuarioService {

	private final CadastrarUsuarioRepository cadastrarUsuarioRepository;
	private final JavaMailSender mailSender;

	@Value("${spring.mail.username:}")
	private String mailFrom;

	@Transactional
	public CadastrarUsuarioResponse cadastrar(CadastrarUsuarioRequest request) {
		String normalized = request.email().trim().toLowerCase();
		if (cadastrarUsuarioRepository.existsByEmailIgnoreCase(normalized)) {
			log.warn("Cadastro rejected: email already exists email={}", normalized);
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado");
		}

		Usuario usuario = new Usuario();
		usuario.setEmail(normalized);
		usuario.setUuidAcesso(UUID.randomUUID());
		usuario.setNome(CadastrarUsuarioHelpers.nomeGenerico(normalized));
		cadastrarUsuarioRepository.save(usuario);
		log.info("Usuario cadastrado id={} email={}", usuario.getId(), normalized);

		enviarCodigoAcesso(usuario);
		return new CadastrarUsuarioResponse("Verifique seu email para o código de acesso");
	}

	private void enviarCodigoAcesso(Usuario usuario) {
		SimpleMailMessage message = new SimpleMailMessage();
		if (mailFrom != null && !mailFrom.isBlank()) {
			message.setFrom(mailFrom);
		}
		message.setTo(usuario.getEmail());
		message.setSubject("Seu acesso ClassPal");
		message.setText("""
				Olá!

				Seu código de acesso único ao ClassPal é:

				%s

				Cole este UUID na tela de login. Guarde-o com segurança.

				— ClassPal
				""".formatted(usuario.getUuidAcesso()));
		mailSender.send(message);
		log.info("Access uuid emailed to {}", usuario.getEmail());
	}
}
