package com.pas.backend.Repository;

import com.pas.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChat_IdOrderByCreatedAtAsc(Long chatId);
}