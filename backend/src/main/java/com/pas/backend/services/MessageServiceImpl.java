package com.pas.backend.services;

import com.pas.backend.Repository.MessageRepository;
import com.pas.backend.Repository.ProjectRepository;
import com.pas.backend.Repository.UserRepository;
import com.pas.backend.model.Chat;
import com.pas.backend.model.Message;
import com.pas.backend.model.Project;
import com.pas.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectService projectService;

    @Override
    public Message sendMessage(Long userId, Long projectId, String content) throws Exception {
        User sender = userRepository.findById(userId).get();
        Chat chat = projectService.getChatByProjectId(projectId);
        Message message = new Message();
        message.setSender(sender);
        message.setChat(chat);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());
        Message savedMessage = messageRepository.save(message);
        chat.getMessages().add(savedMessage);
        return savedMessage;
    }

    @Override
    public List<Message> getMessagesByProjectId(Long projectId) throws Exception {
        Project project = projectService.getProjectById(projectId);

        return messageRepository.findByChat_IdOrderByCreatedAtAsc(project.getChat().getId());
    }
}
