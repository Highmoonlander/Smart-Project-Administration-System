package com.pas.backend.Repository;

import com.pas.backend.model.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvitationRepository extends JpaRepository<Invitation, Integer> {
    Invitation findByToken(String token);
    Invitation findByEmail(String email);
}
