package com.java.social_media.service;

import com.java.social_media.models.Story;
import com.java.social_media.models.User;

import java.util.List;

public interface StoryService {
    Story createStory(Story story, User user);

    List<Story> findStoryByUserId(Integer userId) throws Exception;
}
