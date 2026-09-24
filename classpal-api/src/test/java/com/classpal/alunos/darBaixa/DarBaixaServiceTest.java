package com.classpal.alunos.darBaixa;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.classpal.domain.Aluno;
import com.classpal.domain.Baixa;
import com.classpal.security.AuthenticatedUser;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class DarBaixaServiceTest {

	@Mock
	DarBaixaAlunoRepository darBaixaAlunoRepository;

	@Mock
	DarBaixaRepository darBaixaRepository;

	@InjectMocks
	DarBaixaService darBaixaService;

	private final AuthenticatedUser user = new AuthenticatedUser(
			1L,
			UUID.fromString("11111111-1111-1111-1111-111111111111"),
			"Professor",
			"p@x.com"
	);

	@Test
	void darBaixa_sucesso_decrementaESalvaBaixa() {
		Aluno aluno = new Aluno();
		aluno.setId(5L);
		aluno.setNome("Ana");
		aluno.setAulasDisponiveis(3);
		aluno.setVinculo(1L);
		when(darBaixaAlunoRepository.findByIdAndVinculo(5L, 1L)).thenReturn(Optional.of(aluno));
		when(darBaixaRepository.save(any(Baixa.class))).thenAnswer(inv -> inv.getArgument(0));

		OffsetDateTime quando = OffsetDateTime.parse("2026-09-19T18:00:00-03:00");
		DarBaixaResponse response = darBaixaService.darBaixa(user, 5L, new DarBaixaRequest(quando));

		assertThat(response.aulasDisponiveis()).isEqualTo(2);
		ArgumentCaptor<Baixa> baixaCaptor = ArgumentCaptor.forClass(Baixa.class);
		verify(darBaixaRepository).save(baixaCaptor.capture());
		assertThat(baixaCaptor.getValue().getIdProfessor()).isEqualTo(user.uuidAcesso());
		assertThat(baixaCaptor.getValue().getBaixaEm()).isEqualTo(quando);
	}

	@Test
	void darBaixa_semCredito_deveRetornarConflict() {
		Aluno aluno = new Aluno();
		aluno.setId(5L);
		aluno.setAulasDisponiveis(0);
		aluno.setVinculo(1L);
		when(darBaixaAlunoRepository.findByIdAndVinculo(5L, 1L)).thenReturn(Optional.of(aluno));

		assertThatThrownBy(() -> darBaixaService.darBaixa(
				user,
				5L,
				new DarBaixaRequest(OffsetDateTime.now())
		))
				.isInstanceOf(ResponseStatusException.class)
				.extracting(ex -> ((ResponseStatusException) ex).getStatusCode())
				.isEqualTo(HttpStatus.CONFLICT);

		verify(darBaixaRepository, never()).save(any());
	}

	@Test
	void darBaixa_alunoDeOutroProfessor_deveRetornarNotFound() {
		when(darBaixaAlunoRepository.findByIdAndVinculo(9L, 1L)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> darBaixaService.darBaixa(
				user,
				9L,
				new DarBaixaRequest(OffsetDateTime.now())
		))
				.isInstanceOf(ResponseStatusException.class)
				.extracting(ex -> ((ResponseStatusException) ex).getStatusCode())
				.isEqualTo(HttpStatus.NOT_FOUND);
	}
}
