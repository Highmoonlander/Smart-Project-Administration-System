package com.pas.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pas.backend.Repository.UserRepository;
import com.pas.backend.model.User;
import com.pas.backend.services.UserService;

import io.swagger.v3.oas.models.parameters.RequestBody;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt((jwt));
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateUserProfile(@RequestHeader("Authorization") String jwt,
            @org.springframework.web.bind.annotation.RequestBody User user) throws Exception {
        User curr_user = userService.findUserProfileByJwt((jwt));
        curr_user.setFullName(user.getFullName());
        curr_user.setProjectSize(user.getProjectSize());
        curr_user = userRepository.save(curr_user);
        return new ResponseEntity<>(curr_user, HttpStatus.OK);
    }
}
