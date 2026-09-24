package com.classpal.usuarios.loginUsuario;

import com.classpal.domain.Usuario;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginUsuarioRepository extends JpaRepository<Usuario, Long> {

	Optional<Usuario> findByUuidAcesso(UUID uuidAcesso);
}
