package com.java.social_media.request;

import lombok.Data;

@Data
public class CommentRequest {
    private String content;
    private Integer postId;
}
