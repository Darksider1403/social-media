package com.java.social_media.models;

import com.java.social_media.utils.IdGenerator;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "uuid", unique = true, updatable = false, length = 36)
    private String uuid;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String content;

    private boolean isRead;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Integer referenceId; // ID of related post, comment, etc.

    private String referenceType; // "POST", "COMMENT", etc.

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (uuid == null) {
            uuid = IdGenerator.generateNanoId(12);
        }
    }

}
