package com.classpal.alunos.listarAlunos;

import com.classpal.domain.Aluno;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ListarAlunosRepository extends JpaRepository<Aluno, Long> {

	Page<Aluno> findByVinculo(Long vinculo, Pageable pageable);
}
