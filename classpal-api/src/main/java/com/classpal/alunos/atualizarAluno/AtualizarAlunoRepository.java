package com.classpal.alunos.atualizarAluno;

import com.classpal.domain.Aluno;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AtualizarAlunoRepository extends JpaRepository<Aluno, Long> {

	Optional<Aluno> findByIdAndVinculo(Long id, Long vinculo);
}
