package com.pas.backend.services;

import com.pas.backend.model.Invitation;
import jakarta.mail.MessagingException;

public interface InvitationService {
    void sendInvitation(String email, Long projectId) throws MessagingException;
    Invitation acceptInvitation(String token, Long userId) throws Exception;
    String getTokenByUserMail(String mail) throws Exception;
    void deleteToken(String token);
}
