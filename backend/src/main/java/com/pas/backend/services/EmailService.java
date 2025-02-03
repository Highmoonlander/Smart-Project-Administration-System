package com.pas.backend.services;

import jakarta.mail.MessagingException;

public interface EmailService {
    void sendEmailWithToken(String email, String link) throws MessagingException;
}
