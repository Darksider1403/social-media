package com.java.social_media.models;

import com.java.social_media.utils.IdGenerator;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "chat")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    // Setter for uuid
    @Setter
    @Getter
    @Column(name = "uuid", unique = true, updatable = false, length = 36)
    private String uuid;

    private String chat_name;

    private String chat_image;

    @ManyToMany
    private List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "chat")
    private List<Message> messages = new ArrayList<>();

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (uuid == null) {
            uuid = IdGenerator.generateNanoId(12);
        }
    }
}
