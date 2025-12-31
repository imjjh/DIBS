package com.imjjh.Dibs.auth.controller;

import com.imjjh.Dibs.auth.JwtTokenProvider;
import com.imjjh.Dibs.auth.dto.CurrentUserResponseDto;
import com.imjjh.Dibs.auth.dto.LoginRequestDto;
import com.imjjh.Dibs.auth.dto.LoginResponseDto;
import com.imjjh.Dibs.auth.dto.RegisterRequestDto;
import com.imjjh.Dibs.auth.dto.ValidUsernameRequestDto;
import com.imjjh.Dibs.auth.service.AuthService;
import com.imjjh.Dibs.auth.token.RefreshToken;
import com.imjjh.Dibs.auth.token.repository.RefreshTokenRepository;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthService authService;

    @PostMapping("/validUsername")
    public ResponseEntity<ApiResponse<Void>> validUsername(@Valid @RequestBody ValidUsernameRequestDto requestDto) {
        authService.validUsername(requestDto.username());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of("사용 가능한 아이디 입니다.", null));
    }

    @PostMapping("/register")

    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequestDto requestDto) {
        authService.register(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of("회원가입 성공", null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<CurrentUserResponseDto>> login(@Valid @RequestBody LoginRequestDto requestDto) {
        LoginResponseDto responseDto = authService.login(requestDto);

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", responseDto.accessToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(60 * 60)
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", responseDto.refreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(60 * 60)
                .sameSite("Lax")
                .build();

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(ApiResponse.of("로그인 성공", CurrentUserResponseDto.of(responseDto.user())));
    }

    /**
     * 로그인 상태를 확인하고 로그인된 상태라면 유저 정보를 반환합니다.
     *
     * @param userDetails
     * @return 로그인 ? 유저 정보 : null
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<CurrentUserResponseDto>> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

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
    public ResponseEntity<ApiResponse<Void>> logout() {

        ResponseCookie cookie = ResponseCookie.from("accessToken", "")
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .secure(false) // Local HTTP 환경을 위해 false로 설정
                .httpOnly(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.of("로그아웃 성공", null));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Void>> refresh(
            @CookieValue(name = "refreshToken", required = false) String refreshToken) {

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.of("Refresh Token이 없습니다.", null));
        }

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.of("유효하지 않은 Refresh Token입니다.", null));
        }

        // Redis에 저장된 토큰인지 확인
        Authentication auth = jwtTokenProvider.getAuthentication(refreshToken);
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        String userId = userDetails.getName();

        // Redis에서 userId로 조회
        RefreshToken redisToken = refreshTokenRepository.findById(userId)
                .orElse(null);

        if (redisToken == null || !redisToken.getToken().equals(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.of("토큰이 만료되었거나 일치하지 않습니다.", null));
        }

        String newAccessToken = jwtTokenProvider.createAccessToken(auth);

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", newAccessToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(60 * 60)
                .sameSite("Lax")
                .build();

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .body(ApiResponse.of("Access Token 재발급 성공", null));
    }
}
