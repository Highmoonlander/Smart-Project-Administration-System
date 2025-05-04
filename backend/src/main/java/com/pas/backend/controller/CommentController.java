package com.pas.backend.controller;

import com.pas.backend.model.Comment;
import com.pas.backend.model.User;
import com.pas.backend.request.CreateCommentRequest;
import com.pas.backend.response.MessageResponse;
import com.pas.backend.services.CommentService;
import com.pas.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    CommentService commentService;
    @Autowired
    UserService userService;

    @PostMapping()
    public ResponseEntity<Comment> createComment(
            @RequestBody CreateCommentRequest commentRequest,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Comment createdComment = commentService.createComment(user.getId(), commentRequest.getIssueId(),
                commentRequest.getComment());
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);

    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<MessageResponse> deleteComment(
            @PathVariable Long commentId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        commentService.deleteComment(user.getId(), commentId);
        MessageResponse res = new MessageResponse("Comment deleted");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/{issueId}")
    public ResponseEntity<List<Comment>> getCommentsByIssueId(
            @PathVariable Long issueId) throws Exception {
        List<Comment> comments = commentService.getCommentsFromIssue(issueId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

}
