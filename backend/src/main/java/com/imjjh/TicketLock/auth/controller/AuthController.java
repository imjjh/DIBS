package com.imjjh.TicketLock.auth.controller;

import com.imjjh.TicketLock.auth.dto.CurrentUserResponseDto;
import com.imjjh.TicketLock.auth.user.CustomUserDetails;
import com.imjjh.TicketLock.auth.user.UserEntity;
import com.imjjh.TicketLock.common.dto.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

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
     * accessToken (값이 없고 시간이 0인) 쿠키를 덮어써 기존 쿠키를 제거합니다.
     * TODO: blackList
     * 
     * @param response
     * @return
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

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
}
