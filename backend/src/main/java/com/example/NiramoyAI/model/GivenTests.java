package com.example.NiramoyAI.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "GivenTests")
public class GivenTests {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "prescription_id")
	private Long prescriptionID; // foreign key

	@Column(name = "test_id")
	private String testId;

	@Column(name = "test_name")
	private String testName;

	@Column(name = "ordered_date")
	@Temporal(TemporalType.DATE)
	private Date orderedDate;

	@Column(name = "urgency")
	private String urgency; // routine, urgent, stat

	@Column(name = "test_summary")
	private String testSummary;

	// will update after the result is given
	@Column(name = "report_date")
	@Temporal(TemporalType.DATE)
	private Date reportDate;

	@Column(name = "test_report")
	private String testReport; // url of the image

	@Column(name = "test_report_summary")
	private String testReportSummary;

	@Column(name = "lab_name")
	private String labName;

	@Column(name = "supervisor")
	private String supervisor;

	// Getters and setters
	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public Long getPrescriptionID() { return prescriptionID; }
	public void setPrescriptionID(Long prescriptionID) { this.prescriptionID = prescriptionID; }

	public String getTestId() { return testId; }
	public void setTestId(String testId) { this.testId = testId; }

	public String getTestName() { return testName; }
	public void setTestName(String testName) { this.testName = testName; }

	public Date getOrderedDate() { return orderedDate; }
	public void setOrderedDate(Date orderedDate) { this.orderedDate = orderedDate; }

	public String getUrgency() { return urgency; }
	public void setUrgency(String urgency) { this.urgency = urgency; }

	public String getTestSummary() { return testSummary; }
	public void setTestSummary(String testSummary) { this.testSummary = testSummary; }

	public Date getReportDate() { return reportDate; }
	public void setReportDate(Date reportDate) { this.reportDate = reportDate; }

	public String getTestReport() { return testReport; }
	public void setTestReport(String testReport) { this.testReport = testReport; }

	public String getTestReportSummary() { return testReportSummary; }
	public void setTestReportSummary(String testReportSummary) { this.testReportSummary = testReportSummary; }

	public String getLabName() { return labName; }
	public void setLabName(String labName) { this.labName = labName; }

	public String getSupervisor() { return supervisor; }
	public void setSupervisor(String supervisor) { this.supervisor = supervisor; }
}
