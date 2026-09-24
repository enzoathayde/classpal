package com.classpal.usuarios.cadastrarUsuario;

import com.classpal.domain.Usuario;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CadastrarUsuarioRepository extends JpaRepository<Usuario, Long> {

	boolean existsByEmailIgnoreCase(String email);

	Optional<Usuario> findByUuidAcesso(UUID uuidAcesso);
}
