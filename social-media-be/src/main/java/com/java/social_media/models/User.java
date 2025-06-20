package com.java.social_media.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.java.social_media.utils.IdGenerator;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.processing.Pattern;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "users")
@Entity
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "uuid", unique = true, updatable = false, length = 36)
    private String uuid;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Column(unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Size(min = 8, message = "Password must be at least 6 characters long")
    private String password;
    private String gender;
    private String avatar;
    private String backgroundImage;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @ElementCollection
    private List<Integer> followers = new ArrayList<>();

    @ElementCollection
    private List<Integer> followings = new ArrayList<>();

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "users_saved_posts",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    private List<Post> savedPosts = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "provider")
    private String provider;

    public void savePost(Post post) {
        savedPosts.add(post);
    }

    public void removeSavedPost(Post post) {
        savedPosts.remove(post);
    }

    @JsonProperty("savedPostIds")
    public List<Integer> getSavedPostIds() {
        List<Integer> savedPostIds = new ArrayList<>();
        if (savedPosts != null) {
            for (Post post : savedPosts) {
                savedPostIds.add(post.getId());
            }
        }
        return savedPostIds;
    }

    @PrePersist
    protected void onCreate() {
        if (uuid == null) {
            uuid = IdGenerator.generateNanoId(12);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
