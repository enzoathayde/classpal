package com.classpal.alunos.registrarAluno;

import com.classpal.domain.Aluno;
import com.classpal.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistrarAlunoService {

	private final RegistrarAlunoRepository registrarAlunoRepository;

	@Transactional
	public RegistrarAlunoResponse registrar(AuthenticatedUser user, RegistrarAlunoRequest request) {
		Aluno aluno = new Aluno();
		aluno.setNome(request.nome().trim());
		aluno.setAulasDisponiveis(request.aulasDisponiveis());
		aluno.setVinculo(user.id());
		Aluno saved = registrarAlunoRepository.save(aluno);
		log.info("Aluno criado id={} professorId={}", saved.getId(), user.id());
		return new RegistrarAlunoResponse(saved.getId(), saved.getNome(), saved.getAulasDisponiveis(), saved.getVinculo());
	}
}
