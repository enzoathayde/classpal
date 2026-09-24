package com.classpal.usuarios.cadastrarUsuario;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.classpal.domain.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class CadastrarUsuarioServiceTest {

	@Mock
	CadastrarUsuarioRepository cadastrarUsuarioRepository;

	@Mock
	JavaMailSender mailSender;

	@InjectMocks
	CadastrarUsuarioService cadastrarUsuarioService;

	@BeforeEach
	void setUp() {
		ReflectionTestUtils.setField(cadastrarUsuarioService, "mailFrom", "sender@gmail.com");
	}

	@Test
	void cadastrar_quandoEmailDuplicado_deveRetornarConflict() {
		when(cadastrarUsuarioRepository.existsByEmailIgnoreCase("a@b.com")).thenReturn(true);

		assertThatThrownBy(() -> cadastrarUsuarioService.cadastrar(new CadastrarUsuarioRequest("a@b.com")))
				.isInstanceOf(ResponseStatusException.class)
				.extracting(ex -> ((ResponseStatusException) ex).getStatusCode())
				.isEqualTo(HttpStatus.CONFLICT);

		verify(cadastrarUsuarioRepository, never()).save(any());
		verify(mailSender, never()).send(any(SimpleMailMessage.class));
	}

	@Test
	void cadastrar_sucesso_deveSalvarEEnviarEmail() {
		when(cadastrarUsuarioRepository.existsByEmailIgnoreCase("prof@gmail.com")).thenReturn(false);
		when(cadastrarUsuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> {
			Usuario u = inv.getArgument(0);
			u.setId(10L);
			return u;
		});

		CadastrarUsuarioResponse response = cadastrarUsuarioService.cadastrar(
				new CadastrarUsuarioRequest("prof@gmail.com")
		);

		assertThat(response.mensagem()).contains("email");
		ArgumentCaptor<Usuario> usuarioCaptor = ArgumentCaptor.forClass(Usuario.class);
		verify(cadastrarUsuarioRepository).save(usuarioCaptor.capture());
		assertThat(usuarioCaptor.getValue().getEmail()).isEqualTo("prof@gmail.com");
		assertThat(usuarioCaptor.getValue().getUuidAcesso()).isNotNull();
		verify(mailSender).send(any(SimpleMailMessage.class));
	}
}
