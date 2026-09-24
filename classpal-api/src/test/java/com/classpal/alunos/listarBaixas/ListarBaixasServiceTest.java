package com.classpal.alunos.listarBaixas;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.classpal.domain.Aluno;
import com.classpal.domain.Baixa;
import com.classpal.security.AuthenticatedUser;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class ListarBaixasServiceTest {

	@Mock
	ListarBaixasRepository listarBaixasRepository;

	@InjectMocks
	ListarBaixasService listarBaixasService;

	private final AuthenticatedUser user = new AuthenticatedUser(
			1L,
			UUID.fromString("11111111-1111-1111-1111-111111111111"),
			"Professor",
			"p@x.com"
	);

	@Test
	void listar_semFiltros_usaPadraoPercentEDatasSentinela() {
		Aluno aluno = new Aluno();
		aluno.setId(2L);
		aluno.setNome("Ana");
		Baixa baixa = new Baixa();
		baixa.setId(7L);
		baixa.setAluno(aluno);
		baixa.setBaixaEm(OffsetDateTime.parse("2026-09-10T12:00:00Z"));
		baixa.setIdProfessor(user.uuidAcesso());

		when(listarBaixasRepository.buscarHistorico(any(), any(), any(), any(), any()))
				.thenReturn(new PageImpl<>(List.of(baixa)));

		ListarBaixasResponse response = listarBaixasService.listar(user, null, null, null, null, null);

		assertThat(response.total()).isEqualTo(1);
		assertThat(response.limit()).isEqualTo(20);
		assertThat(response.offset()).isEqualTo(0);
		assertThat(response.items()).hasSize(1);
		assertThat(response.items().getFirst().alunoNome()).isEqualTo("Ana");

		ArgumentCaptor<String> nomeCaptor = ArgumentCaptor.forClass(String.class);
		verify(listarBaixasRepository).buscarHistorico(
				eq(user.uuidAcesso()),
				nomeCaptor.capture(),
				any(),
				any(),
				any(Pageable.class)
		);
		assertThat(nomeCaptor.getValue()).isEqualTo("%");
	}

	@Test
	void listar_comNomeEDatas_montaPattern() {
		when(listarBaixasRepository.buscarHistorico(any(), any(), any(), any(), any()))
				.thenReturn(new PageImpl<>(List.of()));

		listarBaixasService.listar(user, "ana", LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30), 10, 0);

		ArgumentCaptor<String> nomeCaptor = ArgumentCaptor.forClass(String.class);
		verify(listarBaixasRepository).buscarHistorico(
				eq(user.uuidAcesso()),
				nomeCaptor.capture(),
				any(),
				any(),
				any(Pageable.class)
		);
		assertThat(nomeCaptor.getValue()).isEqualTo("%ana%");
	}
}
