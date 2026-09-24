package com.classpal.usuarios.obterMe;

import com.classpal.domain.Usuario;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ObterMeRepository extends JpaRepository<Usuario, Long> {

	Optional<Usuario> findByUuidAcesso(UUID uuidAcesso);
}
