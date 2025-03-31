package com.java.social_media.service;

import com.java.social_media.models.Reels;
import com.java.social_media.models.User;

import java.util.List;

public interface ReelsService {
    Reels createReel(Reels reel, User user);

    List<Reels> findAllReels();

    List<Reels> findUserReels(Integer userId) throws Exception;
}
