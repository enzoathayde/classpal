package com.classpal.alunos.atualizarAluno;

import com.classpal.domain.Aluno;
import com.classpal.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Service
@RequiredArgsConstructor
public class AtualizarAlunoService {

	private final AtualizarAlunoRepository atualizarAlunoRepository;

	@Transactional
	public AtualizarAlunoResponse atualizar(AuthenticatedUser user, Long id, AtualizarAlunoRequest request) {
		Aluno aluno = atualizarAlunoRepository.findByIdAndVinculo(id, user.id())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));

		if (request.nome() != null && !request.nome().isBlank()) {
			aluno.setNome(request.nome().trim());
		}
		if (request.aulasDisponiveis() != null) {
			aluno.setAulasDisponiveis(request.aulasDisponiveis());
		}
		log.info("Aluno atualizado id={} professorId={}", aluno.getId(), user.id());
		return new AtualizarAlunoResponse(aluno.getId(), aluno.getNome(), aluno.getAulasDisponiveis(), aluno.getVinculo());
	}
}
