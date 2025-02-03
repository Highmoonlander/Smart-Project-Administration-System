package com.pas.backend.services;

import com.pas.backend.model.Comment;

import java.util.List;

public interface CommentService {
    Comment createComment(Long userId, Long issueId, String comment) throws  Exception;

    void deleteComment(Long userId, Long commentId) throws  Exception;

    List<Comment> getCommentsFromIssue(Long issueId) throws  Exception;

}
