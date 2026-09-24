package com.classpal.alunos.listarBaixas;

import com.classpal.domain.Baixa;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ListarBaixasRepository extends JpaRepository<Baixa, Long> {

	@Query("""
			SELECT b FROM Baixa b
			JOIN b.aluno a
			WHERE b.idProfessor = :idProfessor
			  AND LOWER(a.nome) LIKE LOWER(:nomePattern)
			  AND b.baixaEm >= :de
			  AND b.baixaEm <= :ate
			""")
	Page<Baixa> buscarHistorico(
			@Param("idProfessor") UUID idProfessor,
			@Param("nomePattern") String nomePattern,
			@Param("de") OffsetDateTime de,
			@Param("ate") OffsetDateTime ate,
			Pageable pageable
	);
}
