package com.pb.ems.auth;

import com.pb.ems.exception.ErrorMessageHandler;
import com.pb.ems.exception.IdentityErrorMessageKey;
import com.pb.ems.exception.IdentityException;
import com.pb.ems.util.Constants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Slf4j
public class JwtTokenUtil {
   // Hex Key:	22ba0f64f69a9f1f10bbbc7d5949486aa0199f44c6d071201d7df7b5c5bae5da
    //Plain text key:	LAC RITE SELL TOLD LAMB GREG ED SKIN JAG LORD HATE PUB JACK RAVE RODE GOAL BET GREW IKE TRIM TONE GILL LIEN TONE
   // Reverse:	22ba0f64f69a9f1f10bbbc7d5949486aa0199f44c6d071201d7df7b5c5bae5da
   private static final String SECRET_KEY = "22ba0f64f69a9f1f10bbbc7d5949486aa0199f44c6d071201d7df7b5c5bae5da"; // Or load from a secure place
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    @Value("${jwt.secret}")
    private static String secret;

    @Value("${jwt.expiration}")
    private static Long expiration;

   /* public static String generateToken(String username, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(Constants.ROLES, roles);
        return doGenerateToken(claims, username);
    }

    private static String doGenerateToken(Map<String, Object> claims, String subject) {

        return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS512, secret).compact();
    }*/
    public static String generateToken(String username, List<String> roles) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .claim(Constants.ROLES, roles)
                .setExpiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(key)
                .compact();

    }

    public static Claims validateToken(String token) throws IdentityException{
        try {
             return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            log.error("Invalid JWT token");
            throw new IdentityException(ErrorMessageHandler.getMessage(IdentityErrorMessageKey.INVALID_TOKEN),
                    HttpStatus.UNAUTHORIZED);
        }
    }

   /* public static Claims validateToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            System.out.println("Invalid JWT token");
            return null;
        }
    }*/
}
