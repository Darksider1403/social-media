package com.java.social_media.models;

import com.java.social_media.utils.IdGenerator;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "reels")
public class Reels {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "uuid", unique = true, updatable = false, length = 36)
    private String uuid;

    private String title;

    private String video;

    @ManyToOne
    private User user;

    @PrePersist
    protected void onCreate() {
        if (uuid == null) {
            uuid = IdGenerator.generateNanoId(12);
        }
    }
}
