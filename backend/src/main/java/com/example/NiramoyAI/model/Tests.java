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

	// Getters and setters
	public Long getTestID() { return testID; }
	public void setTestID(Long testID) { this.testID = testID; }

	public String getTestName() { return testName; }
	public void setTestName(String testName) { this.testName = testName; }

	public String getTestType() { return testType; }
	public void setTestType(String testType) { this.testType = testType; }
}
