package com.classpal.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "baixa", schema = "classpal")
@Getter
@Setter
@NoArgsConstructor
public class Baixa {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "id_aluno", nullable = false)
	private Aluno aluno;

	@Column(name = "baixa_em", nullable = false)
	private OffsetDateTime baixaEm;

	@Column(name = "id_professor", nullable = false)
	private UUID idProfessor;
}
