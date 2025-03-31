package com.java.social_media.models;

import com.java.social_media.utils.IdGenerator;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "story")
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "uuid", unique = true, updatable = false, length = 36)
    private String uuid;

    @ManyToOne
    private User user;

    private String image;

    private String captions;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (uuid == null) {
            uuid = IdGenerator.generateNanoId(12);
        }
    }
}
