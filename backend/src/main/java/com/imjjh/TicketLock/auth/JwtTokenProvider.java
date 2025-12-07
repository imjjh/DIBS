package com.imjjh.TicketLock.auth;

import com.imjjh.TicketLock.auth.user.CustomUserDetails;
import com.imjjh.TicketLock.auth.user.UserEntity;
import com.imjjh.TicketLock.auth.user.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {
    private final Key key;
    private final long tokenValidityInMilliseconds;
    private final UserRepository userRepository;

    public JwtTokenProvider(@Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long tokenValidityInMilliseconds, UserRepository userRepository) {

        // Hex 문자열을 byte 배열로 변환 // openssl rand -base64 32로 생성된 문자열 (jwt.secret)
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes); // 암호화는 바이트로 해야함 // base64는 바이너리 데이터를 텍스트로 표현하는 방법
        this.tokenValidityInMilliseconds = tokenValidityInMilliseconds;
        this.userRepository = userRepository;
    }

    /**
     * JWT 토큰을 생성합니다.
     *
     * @param authentication 인증 정보를 가지고있는 객체
     * @return 완성된 jwt 토큰 (String)
     */
    public String createToken(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String userId = userDetails.getName();

        // 토큰 유효 기간 계산
        long now = (new Date()).getTime();
        Date validity = new Date(now + this.tokenValidityInMilliseconds);

        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date(now))
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 토큰에서 인증 정보(유저 정보) 꺼내기
     *
     * @param accessToken
     * @return
     */
    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token);

        if (claims.getSubject() == null) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }

        Long userId = Long.valueOf(claims.getSubject());
        UserEntity userEntity = userRepository.findWithRolesById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("유저를 찾을 수 없습니다."));

        CustomUserDetails userDetails = new CustomUserDetails(userEntity);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    /**
     * 토큰 유효성 검사
     * 
     * @param token
     * @return
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            log.info("만료된 JWT 서명입니다.");
        } catch (UnsupportedJwtException e) {
            log.info("지원되지 않는 JWT 토큰 입니다.");
        } catch (IllegalArgumentException e) {
            log.info("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }

    /**
     * jws을 파싱하여 정보를 claims를 반환하는 함수
     * 
     * @param accessToken
     * @return Claims (sub, iat, exp, exp, role ...)
     */
    private Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(accessToken)
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }

    }

}
