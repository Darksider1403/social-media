package com.java.social_media.controller;

import com.java.social_media.exceptions.UserException;
import com.java.social_media.models.User;
import com.java.social_media.repository.UserRepository;
import com.java.social_media.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Data
@RestController
@AllArgsConstructor
public class UserController {
    private UserRepository repository;
    private UserService userService;

    @GetMapping("/api/users")
    public List<User> getUser() {
        List<User> users = repository.findAll();

        return users;
    }

    @GetMapping("/api/users/{userId}")
    public User getUserById(@PathVariable("userId") Integer id) throws UserException {
        return userService.findUserById(id);
    }

    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        User savedUser = userService.registerUser(user);

        return savedUser;
    }

    @PutMapping("/api/users")
    public User updateUser(@RequestHeader("Authorization") String jwt, @RequestBody User user)
            throws UserException {
        User requestedUser = userService.findUserByJwt(jwt);
        User updatedUser = userService.updateUser(user, requestedUser.getId());

        return updatedUser;
    }

    @PutMapping("/api/users/follow/{followerId}")
    public User followUserHandler(@RequestHeader("Authorization") String jwt,
            @PathVariable("followerId") Integer followerId) throws UserException {
        User requestedUser = userService.findUserByJwt(jwt);
        User user = userService.followUser(requestedUser.getId(), followerId);

        return user;
    }

    @GetMapping("/api/users/search")
    public List<User> searchUser(@RequestParam String query) {
        List<User> users = userService.searchUsers(query);

        return users;
    }

    @GetMapping("/api/users/profile")
    public User getUserFromToken(@RequestHeader("Authorization") String jwt) {
        User user = userService.findUserByJwt(jwt);
        user.setPassword(null);

        return user;
    }

    @PutMapping("/api/users/avatar")
    public User updateAvatar(@RequestHeader("Authorization") String jwt,
            @RequestBody Map<String, String> request) throws UserException {
        User requestedUser = userService.findUserByJwt(jwt);
        String avatarUrl = request.get("avatarUrl");

        if (avatarUrl == null || avatarUrl.isEmpty()) {
            throw new UserException("Avatar URL is required");
        }

        return userService.updateAvatar(requestedUser.getId(), avatarUrl);
    }

    @GetMapping("/api/users/username/{username}")
    public User getUserByUsername(@PathVariable("username") String username) throws Exception {
        // Remove the @ symbol if it exists
        if (username.startsWith("@")) {
            username = username.substring(1);
        }
        return userService.findUserByUsername(username);
    }
}
