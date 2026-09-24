package com.classpal.alunos.registrarAluno;

import com.classpal.domain.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrarAlunoRepository extends JpaRepository<Aluno, Long> {
}
