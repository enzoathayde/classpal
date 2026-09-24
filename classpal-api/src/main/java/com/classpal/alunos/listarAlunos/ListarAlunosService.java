package com.classpal.alunos.listarAlunos;

import com.classpal.domain.Aluno;
import com.classpal.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ListarAlunosService {

	private static final int DEFAULT_LIMIT = 20;
	private static final int MAX_LIMIT = 100;

	private final ListarAlunosRepository listarAlunosRepository;

	@Transactional(readOnly = true)
	public ListarAlunosPaginaResponse listar(AuthenticatedUser user, Integer limit, Integer offset) {
		int pageSize = limit == null ? DEFAULT_LIMIT : Math.min(Math.max(limit, 1), MAX_LIMIT);
		int pageOffset = offset == null ? 0 : Math.max(offset, 0);
		int pageIndex = pageOffset / pageSize;

		Page<Aluno> page = listarAlunosRepository.findByVinculo(
				user.id(),
				PageRequest.of(pageIndex, pageSize, Sort.by(Sort.Direction.ASC, "nome"))
		);

		log.debug("listarAlunos professorId={} total={}", user.id(), page.getTotalElements());
		return new ListarAlunosPaginaResponse(
				page.getContent().stream()
						.map(a -> new ListarAlunosResponse(a.getId(), a.getNome(), a.getAulasDisponiveis(), a.getVinculo()))
						.toList(),
				page.getTotalElements(),
				pageSize,
				pageOffset
		);
	}
}
