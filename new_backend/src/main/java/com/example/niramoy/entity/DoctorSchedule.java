package com.example.niramoy.entity;

// =========================
// DOCTOR SCHEDULE ENTITY
// =========================
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "doctor_schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    private String hospitalName;

    @Column(name = "day_of_week")
    private String daysOfWeek;
    //saturday =0 ..... friday =6

    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isAvailable;
}
