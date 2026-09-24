package com.classpal.alunos.listarBaixas;

import com.classpal.domain.Baixa;
import com.classpal.security.AuthenticatedUser;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
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
public class ListarBaixasService {

	private static final int DEFAULT_LIMIT = 20;
	private static final int MAX_LIMIT = 100;
	private static final OffsetDateTime DE_PADRAO = OffsetDateTime.parse("1970-01-01T00:00:00Z");
	private static final OffsetDateTime ATE_PADRAO = OffsetDateTime.parse("2999-12-31T23:59:59.999999999Z");

	private final ListarBaixasRepository listarBaixasRepository;

	@Transactional(readOnly = true)
	public ListarBaixasResponse listar(
			AuthenticatedUser user,
			String nome,
			LocalDate de,
			LocalDate ate,
			Integer limit,
			Integer offset
	) {
		int pageSize = limit == null ? DEFAULT_LIMIT : Math.min(Math.max(limit, 1), MAX_LIMIT);
		int pageOffset = offset == null ? 0 : Math.max(offset, 0);
		int pageIndex = pageOffset / pageSize;

		String nomePattern = (nome == null || nome.isBlank()) ? "%" : "%" + nome.trim() + "%";
		ZoneId zone = ZoneId.systemDefault();
		OffsetDateTime deTs = de == null ? DE_PADRAO : de.atStartOfDay(zone).toOffsetDateTime();
		OffsetDateTime ateTs = ate == null ? ATE_PADRAO : ate.atTime(LocalTime.MAX).atZone(zone).toOffsetDateTime();

		Page<Baixa> page = listarBaixasRepository.buscarHistorico(
				user.uuidAcesso(),
				nomePattern,
				deTs,
				ateTs,
				PageRequest.of(pageIndex, pageSize, Sort.by(Sort.Direction.DESC, "baixaEm"))
		);

		log.debug("listarBaixas professorUuid={} total={}", user.uuidAcesso(), page.getTotalElements());
		return new ListarBaixasResponse(
				page.getContent().stream().map(this::toItem).toList(),
				page.getTotalElements(),
				pageSize,
				pageOffset
		);
	}

	private ListarBaixasItemResponse toItem(Baixa baixa) {
		return new ListarBaixasItemResponse(
				baixa.getId(),
				baixa.getAluno().getId(),
				baixa.getAluno().getNome(),
				baixa.getBaixaEm()
		);
	}
}
