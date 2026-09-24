package com.classpal.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario", schema = "classpal")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "uuid_acesso", nullable = false, unique = true)
	private UUID uuidAcesso;

	@Column(nullable = false)
	private String nome;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(name = "criado_em", nullable = false)
	private OffsetDateTime criadoEm;

	@PrePersist
	void onCreate() {
		if (criadoEm == null) {
			criadoEm = OffsetDateTime.now();
		}
		if (uuidAcesso == null) {
			uuidAcesso = UUID.randomUUID();
		}
	}
}
