package com.classpal.alunos.darBaixa;

import com.classpal.domain.Aluno;
import com.classpal.domain.Baixa;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DarBaixaAlunoRepository extends JpaRepository<Aluno, Long> {

	Optional<Aluno> findByIdAndVinculo(Long id, Long vinculo);
}
