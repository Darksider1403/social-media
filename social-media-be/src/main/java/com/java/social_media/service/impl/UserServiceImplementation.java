package com.java.social_media.service.impl;

import com.java.social_media.config.JwtProvider;
import com.java.social_media.exceptions.UserException;
import com.java.social_media.models.Role;
import com.java.social_media.models.User;
import com.java.social_media.repository.UserRepository;
import com.java.social_media.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class UserServiceImplementation implements UserService {
    UserRepository userRepository;

    @Override
    public User registerUser(User user) {
        User newUser = new User();

        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(user.getPassword());
        newUser.setRole(Role.USER);
        newUser.setProvider("local");
        newUser.setGender(user.getGender());
        newUser.setAvatar(user.getAvatar());
        newUser.setBackgroundImage(user.getBackgroundImage());

        return userRepository.save(newUser);
    }

    @Override
    public User findUserById(Integer userId) throws UserException {
        Optional<User> user = userRepository.findById(userId);

        if (user.isPresent()) {
            return user.get();
        }

        throw new UserException("User not exist with id " + userId);
    }

    @Override
    public User findUserByEmail(String email) {
        User user = userRepository.findByEmail(email);

        return user;
    }

    @Override
    public User followUser(Integer requestUser, Integer followerId) throws UserException {
        User reqUser = findUserById(requestUser);
        User follower = findUserById(followerId);

        // Add followerId to the list of followers of the user being followed
        reqUser.getFollowers().add(follower.getId());

        // Add userId to the list of followings of the follower
        follower.getFollowings().add(reqUser.getId());

        // Save both user and follower updates
        userRepository.save(reqUser);
        userRepository.save(follower);

        return reqUser;
    }

    @Override
    public User updateUser(User newUserDetails, Integer id) throws UserException {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserException("User does not exist with id " + id));

        // Update fields if they are not null
        if (newUserDetails.getFirstName() != null) {
            existingUser.setFirstName(newUserDetails.getFirstName());
        }
        if (newUserDetails.getLastName() != null) {
            existingUser.setLastName(newUserDetails.getLastName());
        }
        if (newUserDetails.getEmail() != null) {
            existingUser.setEmail(newUserDetails.getEmail());
        }
        if (newUserDetails.getGender() != null) {
            existingUser.setGender(newUserDetails.getGender());
        }
        if (newUserDetails.getAvatar() != null) {
            existingUser.setAvatar(newUserDetails.getAvatar());
        }
        // Add this for background image
        if (newUserDetails.getBackgroundImage() != null) {
            existingUser.setBackgroundImage(newUserDetails.getBackgroundImage());
        }

        return userRepository.save(existingUser);
    }

    @Override
    public List<User> searchUsers(String query) {
        return userRepository.searchByQuery(query);
    }

    @Override
    public User findUserByJwt(String jwt) {
        String email = JwtProvider.getEmailFromJwtToken(jwt);
        User user = userRepository.findByEmail(email);

        return user;
    }

    @Override
    public User findUserByUuid(String uuid) throws Exception {
        return userRepository.findByUuid(uuid)
                .orElseThrow(() -> new Exception("User not found with uuid: " + uuid));
    }

    @Override
    public User updateAvatar(Integer userId, String avatarUrl) throws UserException {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User does not exist with id " + userId));

        existingUser.setAvatar(avatarUrl);
        return userRepository.save(existingUser);
    }

    @Override
    public User findUserByUsername(String username) throws Exception {
        // Create a username from firstName_lastName if there's no dedicated username field
        List<User> users = userRepository.findAll();
        for (User user : users) {
            String userUsername = (user.getFirstName() + "_" + user.getLastName()).toLowerCase();
            if (userUsername.equals(username.toLowerCase())) {
                return user;
            }
        }
        throw new Exception("User not found with username: " + username);
    }
}
