package com.classpal.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "aluno", schema = "classpal")
@Getter
@Setter
@NoArgsConstructor
public class Aluno {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String nome;

	@Column(name = "aulas_disponiveis", nullable = false)
	private Integer aulasDisponiveis = 0;

	@Column(nullable = false)
	private Long vinculo;

	@Column(name = "criado_em", nullable = false)
	private OffsetDateTime criadoEm;

	@Column(name = "atualizado_em", nullable = false)
	private OffsetDateTime atualizadoEm;

	@PrePersist
	void onCreate() {
		OffsetDateTime now = OffsetDateTime.now();
		criadoEm = now;
		atualizadoEm = now;
		if (aulasDisponiveis == null) {
			aulasDisponiveis = 0;
		}
	}

	@PreUpdate
	void onUpdate() {
		atualizadoEm = OffsetDateTime.now();
	}
}
