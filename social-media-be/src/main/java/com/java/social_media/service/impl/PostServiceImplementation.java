package com.java.social_media.service.impl;

import com.java.social_media.models.Post;
import com.java.social_media.models.User;
import com.java.social_media.repository.PostRepository;
import com.java.social_media.repository.UserRepository;
import com.java.social_media.service.PostService;
import com.java.social_media.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@AllArgsConstructor
@Service
public class PostServiceImplementation implements PostService {
    private PostRepository postRepository;
    private UserRepository userRepository;
    private UserService userService;


    @Override
    public Post createNewPost(Post post, Integer userId) throws Exception {
        Post newPost = new Post();
        User user = userService.findUserById(userId);

        newPost.setCaption(post.getCaption());
        newPost.setImage(post.getImage());
        newPost.setCreatedAt(LocalDateTime.now());
        newPost.setVideo(post.getVideo());
        newPost.setUser(user);

        return postRepository.save(newPost);
    }

    @Override
    public String deletePost(Integer postId, Integer userId) throws Exception {
        Post post = findPostById(postId);
        User user = userService.findUserById(userId);

        if (!Objects.equals(post.getUser().getId(), user.getId())) {
            throw new Exception("You cannot delete a post that you did not create.");
        }

        postRepository.delete(post);
        return "Post deleted Successfully";
    }

    @Override
    public List<Post> findPostByUserId(Integer userId) {
        return postRepository.findPostByUserId(userId);
    }

    @Override
    public Post findPostById(Integer postId) throws Exception {
        Optional<Post> opt = postRepository.findById(postId);
        if (opt.isEmpty()) {
            throw new Exception("Post not found with id: " + postId);
        }

        return opt.get();
    }

    @Override
    public List<Post> findAllPosts() {
        return postRepository.findAll();
    }

    @Override
    public Post savedPost(Integer postId, Integer userId) throws Exception {
        Post post = findPostById(postId);
        User user = userService.findUserById(userId);

        if (user.getSavedPosts().contains(post)) {
            user.removeSavedPost(post);
        } else {
            user.savePost(post);
        }

        userRepository.save(user);

        return post;
    }

    @Override
    public Post likePost(Integer postId, Integer userId) throws Exception {
        Post post = findPostById(postId);
        User user = userService.findUserById(userId);

        if (post.getLiked().contains(user)) {
            post.getLiked().remove(user);
        } else {
            post.getLiked().add(user);
        }

        return postRepository.save(post);
    }
}
