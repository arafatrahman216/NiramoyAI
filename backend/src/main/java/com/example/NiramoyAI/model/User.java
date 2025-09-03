package com.example.NiramoyAI.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    // ==============================================
    // TODO: Patient Health Data Fields (from HealthDataForm)
    // ==============================================
    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @Column(name = "weight", length = 10)
    private String weight;

    @Column(name = "height", length = 10)
    private String height;

    @Column(name = "heart_rate", length = 10)
    private String heartRate;

    @Column(name = "blood_pressure", length = 20)
    private String bloodPressure;

    @Column(name = "blood_type", length = 5)
    private String bloodType;

    @Column(name = "major_health_events", columnDefinition = "TEXT")
    private String majorHealthEvents;

    @Column(name = "lifestyle", columnDefinition = "TEXT")
    private String lifestyle; // JSON string or comma-separated

    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies; // JSON string or comma-separated

    @Column(name = "major_events", columnDefinition = "TEXT")
    private String majorEvents; // JSON string or comma-separated

    @Column(name = "chronic_diseases", columnDefinition = "TEXT")
    private String chronicDiseases; // JSON string or comma-separated

    @Column(name = "calculated_age")
    private Integer calculatedAge;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 50)
    private String username;
    
    @Column(unique = true, nullable = false, length = 100)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;
    
    @Column(name = "phone_number", length = 15)
    private String phoneNumber;
    
    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    // Default constructor
    public User() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructor
    public User(String username, String email, String password, String firstName, String lastName) {
        this();
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    
    // Getters and setters for health data fields
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }

    public String getHeight() { return height; }
    public void setHeight(String height) { this.height = height; }

    public String getHeartRate() { return heartRate; }
    public void setHeartRate(String heartRate) { this.heartRate = heartRate; }

    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }

    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }

    public String getMajorHealthEvents() { return majorHealthEvents; }
    public void setMajorHealthEvents(String majorHealthEvents) { this.majorHealthEvents = majorHealthEvents; }

    public String getLifestyle() { return lifestyle; }
    public void setLifestyle(String lifestyle) { this.lifestyle = lifestyle; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getMajorEvents() { return majorEvents; }
    public void setMajorEvents(String majorEvents) { this.majorEvents = majorEvents; }

    public String getChronicDiseases() { return chronicDiseases; }
    public void setChronicDiseases(String chronicDiseases) { this.chronicDiseases = chronicDiseases; }

    public Integer getCalculatedAge() { return calculatedAge; }
    public void setCalculatedAge(Integer calculatedAge) { this.calculatedAge = calculatedAge; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
