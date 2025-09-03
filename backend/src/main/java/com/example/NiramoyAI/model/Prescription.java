package com.example.NiramoyAI.model;

import jakarta.persistence.*;

@Entity
@Table(name = "prescriptions")
public class Prescription {
	// ==============================================
	// TODO: Prescription Entity Fields
	// ==============================================
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long prescriptionID;

	@Column(name = "vitals_id")
	private Long vitalsID;

	@Column(name = "status", length = 20)
	private String status; // active, completed, discontinued, on-hold

	@Column(name = "medicines", columnDefinition = "TEXT")
	private String medicines; // comma-separated names

	@Column(name = "medicine_ids", columnDefinition = "TEXT")
	private String medicineIds; // comma-separated IDs

	@Column(name = "total_duration", length = 30)
	private String totalDuration;

	@Column(name = "special_instructions", columnDefinition = "TEXT")
	private String specialInstructions;

	@Column(name = "image", length = 255)
	private String image; // URL

	// ==============================================
	// TODO: Add relationships to Visits or User if needed
	// ==============================================

	// Getters and setters
	public Long getPrescriptionID() { return prescriptionID; }
	public void setPrescriptionID(Long prescriptionID) { this.prescriptionID = prescriptionID; }

	public Long getVitalsID() { return vitalsID; }
	public void setVitalsID(Long vitalsID) { this.vitalsID = vitalsID; }

	public String getStatus() { return status; }
	public void setStatus(String status) { this.status = status; }

	public String getMedicines() { return medicines; }
	public void setMedicines(String medicines) { this.medicines = medicines; }

	public String getMedicineIds() { return medicineIds; }
	public void setMedicineIds(String medicineIds) { this.medicineIds = medicineIds; }

	public String getTotalDuration() { return totalDuration; }
	public void setTotalDuration(String totalDuration) { this.totalDuration = totalDuration; }

	public String getSpecialInstructions() { return specialInstructions; }
	public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }

	public String getImage() { return image; }
	public void setImage(String image) { this.image = image; }
}
