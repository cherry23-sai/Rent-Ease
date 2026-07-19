package com.rentease.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {

    public enum Role {
        SUPER_ADMIN,
        CLIENT,
        USER
    }

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(nullable = false)
    private boolean active = true;

    private String phone;

    private String address;

    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;

    private Long approvedBy;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (status == null)
            status = Status.PENDING;
        this.active = true;
    }
}
