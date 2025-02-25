package com.pas.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pas.backend.Repository.ChatRepository;
import com.pas.backend.model.Chat;

@Service
public class ChatServiceImpl implements ChatService{
	
	@Autowired
	private ChatRepository chatRepository;
	
	@Override
	public Chat createChat(Chat chat) {
		// TODO Auto-generated method stub
		return chatRepository.save(chat);
	}
	
}
