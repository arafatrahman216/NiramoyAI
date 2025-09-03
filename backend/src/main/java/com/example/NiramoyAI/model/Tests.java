package com.example.NiramoyAI.model;

import jakarta.persistence.*;

@Entity
@Table(name = "medical_tests")
public class Tests {
	// ==============================================
	// TODO: scrap more field for TEST
	// ==============================================
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long testID;

	@Column(name = "test_name", length = 100)
	private String testName;

	@Column(name = "test_type", length = 50)
	private String testType;



}
