package com.java.social_media.service;

import com.java.social_media.exceptions.UserException;
import com.java.social_media.models.Story;
import com.java.social_media.models.User;

import java.util.List;

public interface StoryService {
    Story createStory(Story story, User user);

    List<Story> findStoryByUserId(Integer userId) throws Exception;

    List<Story> findStoryFeed(Integer userId) throws UserException;

    List<Story> findAllStories();
}
