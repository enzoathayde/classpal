package com.classpal.alunos.listarAlunos;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.classpal.domain.Aluno;
import com.classpal.security.AuthenticatedUser;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@ExtendWith(MockitoExtension.class)
class ListarAlunosServiceTest {

	@Mock
	ListarAlunosRepository listarAlunosRepository;

	@InjectMocks
	ListarAlunosService listarAlunosService;

	private final AuthenticatedUser user = new AuthenticatedUser(
			1L,
			UUID.fromString("11111111-1111-1111-1111-111111111111"),
			"Professor",
			"p@x.com"
	);

	@Test
	void listar_usaDefaultLimitEOffset() {
		Aluno aluno = new Aluno();
		aluno.setId(2L);
		aluno.setNome("Ana");
		aluno.setAulasDisponiveis(4);
		aluno.setVinculo(1L);

		when(listarAlunosRepository.findByVinculo(eq(1L), any(Pageable.class)))
				.thenReturn(new PageImpl<>(List.of(aluno), PageRequest.of(0, 20), 1));

		ListarAlunosPaginaResponse response = listarAlunosService.listar(user, null, null);

		assertThat(response.limit()).isEqualTo(20);
		assertThat(response.offset()).isEqualTo(0);
		assertThat(response.total()).isEqualTo(1);
		assertThat(response.items()).hasSize(1);
		assertThat(response.items().getFirst().nome()).isEqualTo("Ana");

		ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
		verify(listarAlunosRepository).findByVinculo(eq(1L), pageableCaptor.capture());
		assertThat(pageableCaptor.getValue().getPageNumber()).isEqualTo(0);
		assertThat(pageableCaptor.getValue().getPageSize()).isEqualTo(20);
		assertThat(pageableCaptor.getValue().getSort()).isEqualTo(Sort.by(Sort.Direction.ASC, "nome"));
	}

	@Test
	void listar_comOffsetCalculaPagina() {
		when(listarAlunosRepository.findByVinculo(eq(1L), any(Pageable.class)))
				.thenReturn(new PageImpl<>(List.of(), PageRequest.of(1, 10), 25));

		ListarAlunosPaginaResponse response = listarAlunosService.listar(user, 10, 10);

		assertThat(response.limit()).isEqualTo(10);
		assertThat(response.offset()).isEqualTo(10);
		assertThat(response.total()).isEqualTo(25);

		ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
		verify(listarAlunosRepository).findByVinculo(eq(1L), pageableCaptor.capture());
		assertThat(pageableCaptor.getValue().getPageNumber()).isEqualTo(1);
		assertThat(pageableCaptor.getValue().getPageSize()).isEqualTo(10);
	}
}
