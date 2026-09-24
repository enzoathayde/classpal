package com.classpal.usuarios.atualizarNome;

import com.classpal.domain.Usuario;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AtualizarNomeRepository extends JpaRepository<Usuario, Long> {

	Optional<Usuario> findByUuidAcesso(UUID uuidAcesso);
}
