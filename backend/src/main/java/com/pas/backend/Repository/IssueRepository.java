package com.pas.backend.Repository;

import com.pas.backend.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Integer> {
    Issue findById(Long id);
    List<Issue> findByProjectId(Long id);

    void deleteIssueById(Long id);

    Issue getIssueById(Long id);

    List<Issue> getIssueByProjectID(Long projectID);
}
