package com.pas.backend.controller;

import com.pas.backend.model.Issue;
import com.pas.backend.model.User;
import com.pas.backend.request.IssueRequest;
import com.pas.backend.services.IssueService;
import com.pas.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.print.attribute.IntegerSyntax;
import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueController {
    @Autowired
    private IssueService issueService;
    @Autowired
    private UserService userService;

    @GetMapping("/{issueId}")
    public ResponseEntity<Issue> getIssue(@PathVariable Long issueId) throws Exception {
        Issue issue = issueService.getIssueById(issueId);
        return new ResponseEntity<>(issue, HttpStatus.OK);
    }

    @GetMapping("/projects/{projectId}")
    public ResponseEntity<List<Issue>> getIssuesByProjectId(@PathVariable Long projectId) throws Exception {
        List<Issue> issues = issueService.getIssueByProjectId(projectId);
        return new ResponseEntity<>(issues, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Issue> createIssue(
            @RequestBody Issue issue,
            @RequestHeader("Authentication") String jwt
            ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        IssueRequest req = new IssueRequest();
        req.setDescription(issue.getDescription());
        req.setTitle(issue.getTitle());
        req.setPriority(issue.getPriority());
        req.setStatus(issue.getStatus());
        req.setDueDate(issue.getDueDate());

        Issue createdIssue = issueService.createIssue(req, user);
        return new ResponseEntity<>(createdIssue, HttpStatus.CREATED);

    }

    @DeleteMapping("/{issueId")
    public ResponseEntity<Issue> deleteIssue(
            @PathVariable Long issueId,
            @RequestHeader("Authentication") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Issue issue = issueService.getIssueById(issueId);
        issueService.deleteIssue(issueId, user.getId());
        return new ResponseEntity<>(issue, HttpStatus.OK);
    }

    @PostMapping("/{issueId}/assignee/{userId}")
    public ResponseEntity<Issue> addUserToIssue(
            @PathVariable Long issueId,
            @PathVariable Long userId
    ) throws Exception {
        Issue issue = issueService.addUserToIssue(userId, issueId);
        return new ResponseEntity<>(issue, HttpStatus.OK);
    }

    @PutMapping("/{issueId}/status/{status}")
    public ResponseEntity<Issue> updateIssueStatus(
            @PathVariable Long issueId,
            @PathVariable String status
    ) throws Exception {
        Issue issue = issueService.updateStatus(issueId, status);
        return new ResponseEntity<>(issue, HttpStatus.OK);
    }
}
