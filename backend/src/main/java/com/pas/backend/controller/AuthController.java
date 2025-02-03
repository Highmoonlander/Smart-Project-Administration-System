package com.pas.backend.controller;

import com.pas.backend.services.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pas.backend.Repository.UserRepository;
import com.pas.backend.config.JwtProvider;
import com.pas.backend.model.User;
import com.pas.backend.request.LoginRequest;
import com.pas.backend.response.AuthResponse;
import com.pas.backend.services.CustomUserDetailsImpl;

@RestController
@RequestMapping("/auth")
public class AuthController {
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private CustomUserDetailsImpl customUserDetails;
	
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private SubscriptionService subscriptionService;
	
	@PostMapping("/signup")
	public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws Exception{
		User isUserExist = userRepository.findByEmail(user.getEmail());
		
		if(isUserExist != null) {
			throw new Exception("User already exist with other email");
		}
		
		User createUser = new User();
		createUser.setPassword(passwordEncoder.encode(user.getPassword()));
		createUser.setEmail(user.getEmail());
		createUser.setFullName(user.getFullName());
		
		
		User savedUser = userRepository.save(createUser);
		subscriptionService.createSubscription(savedUser);
		
		Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(),user.getPassword());
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		String jwt = JwtProvider.generateToken(authentication);
		
		AuthResponse authResp = new AuthResponse();
		authResp.setJwt(jwt);
		authResp.setMsg("Signup Successful");
		return new ResponseEntity<AuthResponse>(authResp, HttpStatus.CREATED);
	}
	
	@PostMapping("/signin")
	public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest loginRequest){
		String username = loginRequest.getEmail();
		String password = loginRequest.getPassword();
		
		Authentication authentication = authenticate(username, password);
		
		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = JwtProvider.generateToken(authentication);
		
		AuthResponse resp = new AuthResponse();
		resp.setJwt(jwt);
		resp.setMsg("signin successful");
		
		return new ResponseEntity<AuthResponse>(resp, HttpStatus.CREATED);
	}
	
	
	public Authentication authenticate(String username, String password) throws UsernameNotFoundException {
		UserDetails userDetail = customUserDetails.loadUserByUsername(username);
		if(userDetail == null) {
			throw new BadCredentialsException("Wrong Username or Password");
		}
		
		if(!passwordEncoder.matches(password, userDetail.getPassword())) {
			throw new BadCredentialsException("Wrong Username or Password");
		}
		
		return new UsernamePasswordAuthenticationToken(userDetail, null, userDetail.getAuthorities());
	}
}
