package com.imjjh.Dibs.auth.controller;

import com.imjjh.Dibs.auth.JwtTokenProvider;
import com.imjjh.Dibs.auth.dto.CurrentUserResponseDto;
import com.imjjh.Dibs.auth.token.RefreshToken;
import com.imjjh.Dibs.auth.token.repository.RefreshTokenRepository;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.common.dto.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    public AuthController(JwtTokenProvider jwtTokenProvider, RefreshTokenRepository refreshTokenRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    /**
     * 로그인 상태를 확인하고 로그인된 상태라면 유저 정보를 반환합니다.
     * 
     * @param userDetails
     * @return 로그인 ? 유저 정보 : null
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {

        // 비로그인 상태에서도 "/me" 호출 가능
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.of("로그인이 필요합니다.", null));
        }

        UserEntity userEntity = userDetails.getUserEntity();

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.of("조회 성공", CurrentUserResponseDto.of(userEntity)));
    }


    /**
     * 로그아웃 메서드
     * accessToken 쿠키를 덮어써 기존 쿠키를 제거합니다.
     * TODO: blackList, refresh 쿠키 & redis에서 제거
     *
     * @return
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        ResponseCookie cookie = ResponseCookie.from("accessToken", "")
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .secure(false) // Local HTTP 환경을 위해 false로 설정
                .httpOnly(true)
                .build();

        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }


    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        // refreshToken 추출 & 유효성 검사
        String refreshToken = getAllCookies(request).get("refreshToken");

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh Token이 없습니다.");
        }

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 Refresh Token입니다.");
        }

        // Redis에 저장된 토큰인지 확인
        Authentication auth  =  jwtTokenProvider.getAuthentication(refreshToken);
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        String userId = userDetails.getName();

        // Redis에서 userId로 조회
        RefreshToken redisToken = refreshTokenRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Redis에 토큰이 없습니다. (만료됨)"));

        if (!redisToken.getToken().equals(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("토큰 정보가 일치하지 않습니다.");
        }

        String newAccessToken = jwtTokenProvider.createToken(auth);

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", newAccessToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(60 * 60)
                .sameSite("Lax")
                .build();

        response.addHeader("Set-Cookie",accessCookie.toString());

        return ResponseEntity.ok("Access Token 재발급 성공");

    }

    /**
     * 쿠키 배열을 Map으로 변환하는 헬퍼 메서드
     * @param request
     * @return
     */
    private Map<String,String> getAllCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return Collections.emptyMap();
        }

        Map<String, String> cookieMap = new HashMap<>();
        for (Cookie cookie : cookies) {
            cookieMap.put(cookie.getName(), cookie.getValue());
        }

        return cookieMap;
    }
}
