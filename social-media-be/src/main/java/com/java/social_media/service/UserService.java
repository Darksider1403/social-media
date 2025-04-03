package com.java.social_media.service;

import com.java.social_media.exceptions.UserException;
import com.java.social_media.models.User;

import java.util.List;

public interface UserService {
    User registerUser(User user);

    User findUserById(Integer userId) throws UserException;

    User findUserByEmail(String email);

    User followUser(Integer userId, Integer followerId) throws UserException;

    User updateUser(User user, Integer userId) throws UserException;

    List<User> searchUsers(String query);

    User findUserByJwt(String jwt);

    User findUserByUuid(String uuid) throws Exception;

    User updateAvatar(Integer userId, String avatarUrl) throws UserException;

    User findUserByUsername(String username) throws Exception;
}
