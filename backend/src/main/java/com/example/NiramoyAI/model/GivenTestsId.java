package com.example.NiramoyAI.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class GivenTestsId implements Serializable {
    private Long prescriptionID;
    private Long testId;

    // Default constructor
    public GivenTestsId() {}

    // Constructor
    public GivenTestsId(Long prescriptionID, Long testId) {
        this.prescriptionID = prescriptionID;
        this.testId = testId;
    }

    // Getters and setters
    public Long getPrescriptionID() {
        return prescriptionID;
    }

    public void setPrescriptionID(Long prescriptionID) {
        this.prescriptionID = prescriptionID;
    }

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    // equals and hashCode methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GivenTestsId that = (GivenTestsId) o;
        return Objects.equals(prescriptionID, that.prescriptionID) &&
               Objects.equals(testId, that.testId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(prescriptionID, testId);
    }
}
