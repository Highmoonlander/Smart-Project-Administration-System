package com.pas.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pas.backend.model.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long>{

}
