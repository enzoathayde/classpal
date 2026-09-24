package com.classpal.alunos.darBaixa;

import com.classpal.domain.Aluno;
import com.classpal.domain.Baixa;
import com.classpal.security.AuthenticatedUser;
import java.time.OffsetDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Service
@RequiredArgsConstructor
public class DarBaixaService {

	private final DarBaixaAlunoRepository darBaixaAlunoRepository;
	private final DarBaixaRepository darBaixaRepository;

	@Transactional
	public DarBaixaResponse darBaixa(AuthenticatedUser user, Long alunoId, DarBaixaRequest request) {
		if (request.baixaEm().isAfter(OffsetDateTime.now().plusMinutes(1))) {
			log.warn("Dar baixa rejected: future datetime alunoId={}", alunoId);
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível registrar aula no futuro");
		}

		Aluno aluno = darBaixaAlunoRepository.findByIdAndVinculo(alunoId, user.id())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));

		if (aluno.getAulasDisponiveis() <= 0) {
			log.warn("Dar baixa rejected: no credits alunoId={}", alunoId);
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Sem aulas disponíveis para dar baixa");
		}

		aluno.setAulasDisponiveis(aluno.getAulasDisponiveis() - 1);

		Baixa baixa = new Baixa();
		baixa.setAluno(aluno);
		baixa.setBaixaEm(request.baixaEm());
		baixa.setIdProfessor(user.uuidAcesso());
		darBaixaRepository.save(baixa);

		log.info("Baixa registrada alunoId={} professorUuid={} baixaEm={}", alunoId, user.uuidAcesso(), request.baixaEm());
		return new DarBaixaResponse(aluno.getId(), aluno.getNome(), aluno.getAulasDisponiveis(), aluno.getVinculo());
	}
}
