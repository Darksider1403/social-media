package com.java.social_media.controller;

import com.java.social_media.models.Post;
import com.java.social_media.models.User;
import com.java.social_media.response.ApiResponse;
import com.java.social_media.service.PostService;
import com.java.social_media.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class PostController {
    private PostService postService;
    private UserService userService;

    @PostMapping("/api/posts")
    public ResponseEntity<Post> createPost(@RequestHeader("Authorization") String jwt,
                                           @RequestBody Post post) throws Exception {
        User requestedUser = userService.findUserByJwt(jwt);
        Post createdPost = postService.createNewPost(post, requestedUser.getId());

        return new ResponseEntity<>(createdPost, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/api/posts/{postId}")
    public ResponseEntity<ApiResponse> deletePost(@PathVariable Integer postId,
                                                  @RequestHeader("Authorization") String jwt) throws Exception {
        User requestedUser = userService.findUserByJwt(jwt);
        String message = postService.deletePost(postId, requestedUser.getId());
        ApiResponse response = new ApiResponse(message, true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/api/posts/{postId}")
    public ResponseEntity<Post> findPostById(@PathVariable Integer postId) throws Exception {
        Post post = postService.findPostById(postId);

        return new ResponseEntity<>(post, HttpStatus.ACCEPTED);
    }

    @GetMapping("/api/posts/user/{userId}")
    public ResponseEntity<List<Post>> findUsersPosts(@PathVariable Integer userId) {
        List<Post> posts = postService.findPostByUserId(userId);

        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/api/posts")
    public ResponseEntity<List<Post>> findAllPosts() {
        List<Post> posts = postService.findAllPosts();

        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @PutMapping("/api/posts/save/{postId}")
    public ResponseEntity<Post> savedPostHandler(@PathVariable Integer postId,
                                                 @RequestHeader("Authorization") String jwt) throws Exception {
        User requestedUser = userService.findUserByJwt(jwt);
        Post savedPost = postService.savedPost(postId, requestedUser.getId());

        return new ResponseEntity<>(savedPost, HttpStatus.ACCEPTED);
    }

    @PutMapping("/api/posts/like/{postId}")
    public ResponseEntity<Post> likePostHandler(@PathVariable Integer postId,
                                                @RequestHeader("Authorization") String jwt) throws Exception {
        User requestedUser = userService.findUserByJwt(jwt);
        Post likedPost = postService.likePost(postId, requestedUser.getId());

        return new ResponseEntity<>(likedPost, HttpStatus.ACCEPTED);
    }
}
