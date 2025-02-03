package com.pas.backend.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pas.backend.Repository.ProjectRepository;
import com.pas.backend.model.Chat;
import com.pas.backend.model.Project;
import com.pas.backend.model.User;


@Service
public class ProjectServiceImpl implements ProjectService {
	
	@Autowired
	private ProjectRepository projectRepository; 
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private ChatService chatService;

	@Override
	public Project createProject(Project project, User user) throws Exception {
		// TODO Auto-generated method stub
		Project createdProject = new Project();
		createdProject.setOwner(user);
		createdProject.setName(project.getName());
		createdProject.setCategory(project.getCategory());
		createdProject.setDescription(project.getDescription());
		createdProject.getTeam().add(user);
		createdProject.setTags(project.getTags());
		
		Project savedProject = projectRepository.save(createdProject);
		
		
		Chat chat = new Chat();
		chat.setProject(savedProject);
		
		Chat projectChat = chatService.createChat(chat);
		savedProject.setChat(projectChat);
		
		return savedProject;
	}

	@Override
	public List<Project> getProjectByTeam(User user, String category, String tag) throws Exception {
		// TODO Auto-generated method stub
		List<Project> projects = projectRepository.findByTeamContainingOrOwner(user, user);
		if(category != null) {
			projects = projects.stream().filter(project -> category.equals(project.getCategory()))
					.toList();
		}
		if(tag != null) {
			projects = projects.stream().filter(project -> project.getTags().contains(tag)).toList();
		}
		return projects;
	}

	@Override
	public Project getProjectById(Long projectId) throws Exception {
		// TODO Auto-generated method stub
		Optional<Project> project = projectRepository.findById(projectId);
		if(project.isEmpty()) {
			throw new Exception("Project not found");
		}
		return project.get();
	}

	@Override
	public void deleteProject(Long projectId, Long userId) throws Exception {
		// TODO Auto-generated method stub
		projectRepository.deleteById(projectId);
	}

	@Override
	public Project updateProject(Project updatedProject, Long id) throws Exception {
		// TODO Auto-generated method stub
		Optional<Project> project = projectRepository.findById(id);
		if(project.isEmpty()) {
			throw new Exception("Project not found");
		}
		Project currproject = project.get();
		currproject.setName(updatedProject.getName());
		currproject.setDescription(updatedProject.getDescription());
		currproject.setTags(updatedProject.getTags());

		return projectRepository.save(currproject);
	}

	@Override
	public void addUserToProject(Long projectId, Long userId) throws Exception {
		// TODO Auto-generated method stub
		Project project = getProjectById(projectId);
		User user = userService.findUserById(userId);
		if(user == null) {
			throw new Exception("User not found");
		}
		if(!project.getTeam().contains(user)) {
			project.getTeam().add(user);
			project.getChat().getUsers().add(user);
		}
		projectRepository.save(project);
	}

	@Override
	public void removeUserFromProject(Long projectId, Long userId) throws Exception {
		// TODO Auto-generated method stub
		Project project = getProjectById(projectId);
		User user = userService.findUserById(userId);
		if(user == null) {
			throw new Exception("User not found");
		}
		if(project.getTeam().contains(user)) {
			project.getTeam().remove(user);
			project.getChat().getUsers().remove(user);
		}
		projectRepository.save(project);
	}

	@Override
	public Chat getChatByProjectId(Long projectId) throws Exception {
		// TODO Auto-generated method stub
		Project project = getProjectById(projectId);

		return project.getChat();
	}

	@Override
	public List<Project> searchProject(String keyword, User user) throws Exception {
		return projectRepository.findByNameContainingAndTeamContaining(keyword, user);

	}

}
