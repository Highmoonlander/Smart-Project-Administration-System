package com.pas.backend.services;

import com.pas.backend.Repository.IssueRepository;
import com.pas.backend.Repository.ProjectRepository;
import com.pas.backend.Repository.UserRepository;
import com.pas.backend.model.Issue;
import com.pas.backend.model.Project;
import com.pas.backend.model.User;
import com.pas.backend.request.IssueRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class IssueServiceImpl implements IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @Override
    public Issue getIssueById(Long issueId) throws Exception {
        Issue issue = issueRepository.findById(issueId);
        return issue;
    }

    @Override
    public List<Issue> getIssueByProjectId(Long projectId) throws Exception {
        List<Issue> issues = issueRepository.getIssueByProjectID(projectId);
        return issues;
    }

    @Override
    public Issue createIssue(IssueRequest req, User userId) throws Exception {
        Project project = projectService.getProjectById(req.getProjectID());

        Issue issue = new Issue();
        issue.setProjectID(project.getId());
        issue.setTitle(req.getTitle());
        issue.setDescription(req.getDescription());
        issue.setPriority(req.getPriority());
        issue.setStatus(req.getStatus());
        issue.setDueDate(req.getDueDate());

        issue.setProject(project);
        return issueRepository.save(issue);
    }

    // @Override
    // public void deleteIssue(Long issueId, Long userId) throws Exception {
    // getIssueById(issueId);
    // issueRepository.deleteIssueById(issueId);
    // }
    @Override
    @Transactional
    public void deleteIssue(Long issueId, Long userId) throws Exception {
        Issue issue = getIssueById(issueId);
        issueRepository.deleteIssueById(issueId); // standard JPA method
    }

    @Override
    public Issue addUserToIssue(Long issueId, Long userId) throws Exception {
        User user = userService.findUserById(userId);
        Issue issue = getIssueById(issueId);
        issue.setAssignee(user);
        return issueRepository.save(issue);
    }

    @Override
    public Issue updateStatus(Long issueId, String status) throws Exception {
        Issue issue = getIssueById(issueId);
        issue.setStatus(status);
        return issueRepository.save(issue);
    }
}
