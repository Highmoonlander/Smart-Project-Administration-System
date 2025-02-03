package com.pas.backend.controller;

import com.pas.backend.model.Chat;
import com.pas.backend.model.Message;
import com.pas.backend.model.Project;
import com.pas.backend.model.User;
import com.pas.backend.request.MessageRequest;
import com.pas.backend.services.MessageService;
import com.pas.backend.services.ProjectService;
import com.pas.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProjectService projectService;

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(
            @RequestBody MessageRequest messageRequest
    ) throws Exception {
        User user = userService.findUserById(messageRequest.getSenderId());
        if(user == null) {
            throw new Exception("User not found");
        }
        Chat chat = projectService.getChatByProjectId(messageRequest.getSenderId());
        if(chat == null) {
            throw new Exception("Chat not found");
        }
        Message message = messageService.sendMessage(user.getId(), messageRequest.getSenderId(), messageRequest.getContent());
        return new ResponseEntity<>(message, HttpStatus.CREATED);
    }

    @GetMapping("/chat/{projectId}")
    public ResponseEntity<List<Message>> getMesssageByChatId(
        @PathVariable Long projectId
    )throws Exception {
        List<Message> messages = messageService.getMessagesByProjectId(projectId);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }
}
