package com.example.NiramoyAI.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "GivenTests")
public class GivenTests {
	@EmbeddedId
	private GivenTestsId id;

	@ManyToOne
	@MapsId("prescriptionID")
	@JoinColumn(name = "prescription_id")
	private Prescription prescription;

	@ManyToOne
	@MapsId("testId")
	@JoinColumn(name = "test_id")
	private Tests test;

	@Column(name = "test_name")
	private String testName;

	@Column(name = "ordered_date")
	private LocalDate orderedDate;

	@Column(name = "urgency")
	private String urgency; // routine, urgent, stat

	@Column(name = "test_summary")
	private String testSummary;

	// will update after the result is given
	@Column(name = "report_date")
	private LocalDate reportDate;

	@Column(name = "test_report")
	private String testReport; // url of the image

	@Column(name = "test_report_summary")
	private String testReportSummary;

	@Column(name = "lab_name")
	private String labName;

	@Column(name = "supervisor")
	private String supervisor;

	// Constructors
	public GivenTests() {}

	public GivenTests(Prescription prescription, Tests test) {
		this.prescription = prescription;
		this.test = test;
		this.id = new GivenTestsId(prescription.getPrescriptionID(), test.getTestID());
	}

	// Getters and setters
	public GivenTestsId getId() { return id; }
	public void setId(GivenTestsId id) { this.id = id; }

	public Prescription getPrescription() { return prescription; }
	public void setPrescription(Prescription prescription) { 
		this.prescription = prescription;
		if (this.id == null) {
			this.id = new GivenTestsId();
		}
		this.id.setPrescriptionID(prescription.getPrescriptionID());
	}

	public Tests getTest() { return test; }
	public void setTest(Tests test) { 
		this.test = test;
		if (this.id == null) {
			this.id = new GivenTestsId();
		}
		this.id.setTestId(test.getTestID());
	}

	public String getTestName() { return testName; }
	public void setTestName(String testName) { this.testName = testName; }

	public LocalDate getOrderedDate() { return orderedDate; }
	public void setOrderedDate(LocalDate orderedDate) { this.orderedDate = orderedDate; }

	public String getUrgency() { return urgency; }
	public void setUrgency(String urgency) { this.urgency = urgency; }

	public String getTestSummary() { return testSummary; }
	public void setTestSummary(String testSummary) { this.testSummary = testSummary; }

	public LocalDate getReportDate() { return reportDate; }
	public void setReportDate(LocalDate reportDate) { this.reportDate = reportDate; }

	public String getTestReport() { return testReport; }
	public void setTestReport(String testReport) { this.testReport = testReport; }

	public String getTestReportSummary() { return testReportSummary; }
	public void setTestReportSummary(String testReportSummary) { this.testReportSummary = testReportSummary; }

	public String getLabName() { return labName; }
	public void setLabName(String labName) { this.labName = labName; }

	public String getSupervisor() { return supervisor; }
	public void setSupervisor(String supervisor) { this.supervisor = supervisor; }
}
