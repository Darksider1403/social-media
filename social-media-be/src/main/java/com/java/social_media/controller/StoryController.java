package com.java.social_media.controller;

import com.java.social_media.models.Story;
import com.java.social_media.models.User;
import com.java.social_media.service.StoryService;
import com.java.social_media.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class StoryController {
    private StoryService storyService;
    private UserService userService;

    @PostMapping("/api/story")
    public Story createStory(@RequestBody Story story,
                             @RequestHeader("Authorization") String jwt) {
        User reqUser = userService.findUserByJwt(jwt);
        Story newStory = storyService.createStory(story, reqUser);

        return newStory;
    }

    @GetMapping("/api/story/user/{userId}")
    public List<Story> findUsersStory(@PathVariable Integer userId) throws Exception {
        List<Story> stories = storyService.findStoryByUserId(userId);

        return stories;
    }
}
