package com.example.niramoy.entity;

import com.example.niramoy.enumerate.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "unique_email", columnNames = "email"),
                @UniqueConstraint(name = "unique_username", columnNames = "username")
        },
        indexes = {
                @Index(name = "idx_users_created_at", columnList = "created_at"),
                @Index(name = "idx_users_email", columnList = "email"),
                @Index(name = "idx_users_status", columnList = "status"),
                @Index(name = "idx_users_username", columnList = "username")
        }
)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // bigserial
    private Long id;

    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    // Kept as String to match the VARCHAR column (DB default handled by database)
    @Column(name = "status", length = 255)
    private String status;

    //  CURRENT_TIMESTAMP;  set by JPA
    @Column(name = "created_at", insertable = false, updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "role",nullable = false)
    private Role role;

    @Column(name= "gender")
    private String gender;

    @Column(name= "profile_picture_url")
    private String profilePictureUrl;

    @Column(name= "date_of_birth")
    private LocalDate dateOfBirth;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private HealthProfile healthProfile;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<HealthLog> healthLogs;





    public User(String username, String email, String password, String name) {
        this.username=username;
        this.email= email;
        this.password= password;
        this.name= name;
    }
}
