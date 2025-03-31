package com.java.social_media.service.impl;

import com.java.social_media.models.Story;
import com.java.social_media.models.User;
import com.java.social_media.repository.StoryRepository;
import com.java.social_media.service.StoryService;
import com.java.social_media.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class StoryServiceImplementation implements StoryService {
    private StoryRepository storyRepository;
    private UserService userService;

    @Override
    public Story createStory(Story story, User user) {
        Story newStory = new Story();
        newStory.setCaptions(story.getCaptions());
        newStory.setUser(user);
        newStory.setImage(story.getImage());
        newStory.setTimestamp(LocalDateTime.now());

        return storyRepository.save(newStory);
    }

    @Override
    public List<Story> findStoryByUserId(Integer userId) throws Exception {
        User user = userService.findUserById(userId);

        return storyRepository.findByUserId(user.getId());
    }
}
