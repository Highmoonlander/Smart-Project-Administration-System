package com.pas.backend.services;

import com.pas.backend.model.Message;

import java.util.List;

public interface MessageService {
    Message sendMessage(Long userId, Long projectId, String content) throws Exception;

    List<Message> getMessagesByProjectId(Long projectId) throws Exception;

}
