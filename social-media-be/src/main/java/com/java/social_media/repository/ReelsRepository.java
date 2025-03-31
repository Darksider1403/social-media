package com.java.social_media.repository;

import com.java.social_media.models.Reels;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReelsRepository extends JpaRepository<Reels, Integer> {
    List<Reels> findByUserId(Integer userId);
}
