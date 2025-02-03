package com.pas.backend.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.pas.backend.model.User;

public interface UserRepository extends JpaRepository<User,Long>{
	User findByEmail(String email);
}
