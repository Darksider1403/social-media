package com.java.social_media.repository;

import com.java.social_media.models.Story;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface StoryRepository extends JpaRepository<Story, Integer> {
    List<Story> findByUserId(Integer userId);

    List<Story> findByTimestampAfter(LocalDateTime timestamp);
}
