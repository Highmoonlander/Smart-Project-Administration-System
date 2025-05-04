package com.pas.backend.config;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.Authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtProvider {
	private static SecretKey key = Keys.hmacShaKeyFor(JwtConstants.SECRET_KEY.getBytes());

	public static String generateToken(Authentication auth) {
		return Jwts.builder().setIssuedAt(new Date())
				.setExpiration(new Date(new Date().getTime() + 86400000))
				.claim("email", auth.getName())
				.signWith(key)
				.compact();
	}

	public static String getEmailFromToken(String jwt) {
		System.out.println("----------------------------");
		jwt = jwt.substring(7);

		// Claims claims =
		// Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
		Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
		return String.valueOf(claims.get("email"));
	}
}
