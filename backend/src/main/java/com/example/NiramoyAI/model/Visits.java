package com.example.NiramoyAI.model;

import jakarta.persistence.*;

@Entity
@Table(name = "visits")
public class Visits {
	// ==============================================
	// TODO: Visits Entity Fields
	// ==============================================
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long visitID;

	@Column(name = "visit_count")
	private Integer visitCount;

	@Column(name = "date", length = 30)
	private String date;

	@Column(name = "visit_type", length = 30)
	private String visitType; // routine, emergency, follow-up, consultation

	@Column(name = "chief_complaint", columnDefinition = "TEXT")
	private String chiefComplaint;

	@Column(name = "visit_summary", columnDefinition = "TEXT")
	private String visitSummary;

	@Column(name = "status", length = 20)
	private String status; // completed, in-progress, cancelled

	// ==============================================
	// Relationships
	// ==============================================
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "prescription_id")
	private Prescription prescription;

	// ==============================================
	// TODO: Add relationships to User and Prescription entities if needed
	// ==============================================

	// Getters and setters
	public Long getVisitID() { return visitID; }
	public void setVisitID(Long visitID) { this.visitID = visitID; }

	public Integer getVisitCount() { return visitCount; }
	public void setVisitCount(Integer visitCount) { this.visitCount = visitCount; }

	public String getDate() { return date; }
	public void setDate(String date) { this.date = date; }

	public String getVisitType() { return visitType; }
	public void setVisitType(String visitType) { this.visitType = visitType; }

	public String getChiefComplaint() { return chiefComplaint; }
	public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }

	public String getVisitSummary() { return visitSummary; }
	public void setVisitSummary(String visitSummary) { this.visitSummary = visitSummary; }

	public String getStatus() { return status; }
	public void setStatus(String status) { this.status = status; }

	public User getUser() { return user; }
	public void setUser(User user) { this.user = user; }

	public Prescription getPrescription() { return prescription; }
	public void setPrescription(Prescription prescription) { this.prescription = prescription; }
}
