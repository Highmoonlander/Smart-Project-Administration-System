package com.pas.backend.services;

import com.pas.backend.Repository.CommentRepository;
import com.pas.backend.Repository.IssueRepository;
import com.pas.backend.Repository.UserRepository;
import com.pas.backend.model.Comment;
import com.pas.backend.model.Issue;
import com.pas.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Override
    public Comment createComment(Long userId, Long issueId, String comment) throws Exception {
        Issue issue = issueRepository.findById(issueId);
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new Exception("User not found");
        }
        if(issue == null) {
            throw new Exception("Issue not found");
        }
        Comment createdComment = new Comment();
        createdComment.setIssue(issue);
        createdComment.setUser(user.get());
        createdComment.setContent(comment);
        createdComment.setCreatedDateTime(LocalDateTime.now());
        Comment savedCommnet = commentRepository.save(createdComment);
        issue.getComments().add(savedCommnet);
        return savedCommnet;
    }

    @Override
    public void deleteComment(Long userId, Long commentId) throws Exception {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new Exception("User not found");
        }
        Optional<Comment> comment = commentRepository.findById(commentId);
        if (comment.isEmpty()) {
            throw new Exception("Comment not found");
        }

        if(!comment.get().getUser().equals(user.get())) {
            throw new Exception("You are not the owner of this comment!");
        }
        commentRepository.delete(comment.get());
    }

    @Override
    public List<Comment> getCommentsFromIssue(Long issueId) throws Exception {
        Issue issue = issueRepository.findById(issueId);
        if(issue == null) {
            throw new Exception("Issue not found");
        }
        List<Comment> comment = commentRepository.findCommentByIssueId(issueId);
        if(comment.isEmpty()) {
            throw new Exception("Comment not found");
        }
        return comment;
    }
}
