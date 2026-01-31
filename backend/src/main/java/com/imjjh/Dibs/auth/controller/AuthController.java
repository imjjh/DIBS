package com.imjjh.Dibs.auth.controller;

import com.imjjh.Dibs.auth.JwtTokenProvider;
import com.imjjh.Dibs.auth.dto.*;
import com.imjjh.Dibs.auth.service.AuthService;
import com.imjjh.Dibs.auth.token.RefreshToken;
import com.imjjh.Dibs.auth.token.repository.RefreshTokenRepository;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;
import com.imjjh.Dibs.auth.exception.AuthErrorCode;
import com.imjjh.Dibs.common.exception.BusinessException;
import org.springframework.http.HttpHeaders;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "인증 관련 API", description = "로그인, 회원가입, 토큰 재발급 등 인증 관련 기능을 제공합니다.")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

        private final JwtTokenProvider jwtTokenProvider;
        private final RefreshTokenRepository refreshTokenRepository;
        private final AuthService authService;

        @Operation(summary = "아이디 중복 확인", description = "입력한 아이디가 이미 존재하는지 확인합니다.")
        @PostMapping("/validateUsername")
        @ResponseStatus(HttpStatus.OK)
        public ApiResponse<Void> validateUsername(
                        @Valid @RequestBody ValidUsernameRequestDto requestDto) {
                authService.validateUsername(requestDto.username());
                return ApiResponse.success();
        }

        @Operation(summary = "이메일 중복 확인", description = "입력한 이메일이 이미 존재하는지 확인합니다.")
        @PostMapping("/validateEmail")
        @ResponseStatus(HttpStatus.OK)
        public ApiResponse<Void> validateEmail(@Valid @RequestBody ValidEmailRequestDto requestDto) {
                authService.validateEmail(requestDto.email());
                return ApiResponse.success();
        }

        @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다.")
        @PostMapping("/register")
        @ResponseStatus(HttpStatus.CREATED)
        public ApiResponse<Void> register(@Valid @RequestBody RegisterRequestDto requestDto) {
                authService.register(requestDto);
                return ApiResponse.success();
        }

        @Operation(summary = "로그인", description = "사용자 인증을 진행하고 쿠키에 토큰을 설정합니다.")
        @PostMapping("/login")
        @ResponseStatus(HttpStatus.OK)
        public ApiResponse<CurrentUserResponseDto> login(
                        @Valid @RequestBody LoginRequestDto requestDto, HttpServletResponse response) {
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

                response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
                response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

                return ApiResponse.success(CurrentUserResponseDto.of(responseDto.user()));
        }

        @Operation(summary = "현재 사용자 정보 조회", description = "로그인된 사용자의 정보를 가져옵니다.")
        @GetMapping("/me")
        @ResponseStatus(HttpStatus.OK)
        public ApiResponse<CurrentUserResponseDto> getCurrentUser(
                        @AuthenticationPrincipal CustomUserDetails userDetails) {

                // 비로그인 상태에서도 "/me" 호출 가능
                if (userDetails == null) {
                        throw new BusinessException(AuthErrorCode.UNAUTHORIZED_USER);
                }

                UserEntity userEntity = userDetails.getUserEntity();

                return ApiResponse.success(CurrentUserResponseDto.of(userEntity));
        }

        @Operation(summary = "로그아웃", description = "사용자 세션을 종료하고 토큰 쿠키를 제거합니다.")
        @PostMapping("/logout")
        @ResponseStatus(HttpStatus.OK)
        public ApiResponse<Void> logout(@AuthenticationPrincipal CustomUserDetails userDetails,
                        HttpServletResponse response) {

                // Redis에서 RefreshToken 삭제
                if (userDetails != null) {
                        refreshTokenRepository.deleteById(userDetails.getName());
                }

                // AccessToken 쿠키 삭제
                ResponseCookie accessCookie = ResponseCookie.from("accessToken", "")
                                .path("/")
                                .maxAge(0)
                                .sameSite("Lax")
                                .secure(true)
                                .httpOnly(true)
                                .build();

                // RefreshToken 쿠키 삭제
                ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
                                .path("/")
                                .maxAge(0)
                                .sameSite("Lax")
                                .secure(true)
                                .httpOnly(true)
                                .build();

                response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
                response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

                return ApiResponse.success();
        }

        @Operation(summary = "토큰 재발급", description = "RefreshToken을 통해 새로운 AccessToken을 발급받습니다.")
        @PostMapping("/refresh")
        @ResponseStatus(HttpStatus.OK)
        public ApiResponse<Void> refresh(
                        @CookieValue(name = "refreshToken", required = false) String refreshToken,
                        HttpServletResponse response) {

                if (refreshToken == null) {
                        throw new BusinessException(AuthErrorCode.INVALID_REFRESH_TOKEN);
                }

                if (!jwtTokenProvider.validateToken(refreshToken)) {
                        throw new BusinessException(AuthErrorCode.INVALID_REFRESH_TOKEN);
                }

                // Redis에 저장된 토큰인지 확인
                Authentication auth = jwtTokenProvider.getAuthentication(refreshToken);
                CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                String userId = userDetails.getName();

                // Redis에서 userId로 조회
                RefreshToken redisToken = refreshTokenRepository.findById(userId)
                                .orElse(null);

                if (redisToken == null || !redisToken.getToken().equals(refreshToken)) {
                        throw new BusinessException(AuthErrorCode.INVALID_REFRESH_TOKEN);
                }

                String newAccessToken = jwtTokenProvider.createAccessToken(auth);

                ResponseCookie accessCookie = ResponseCookie.from("accessToken", newAccessToken)
                                .httpOnly(true)
                                .secure(true)
                                .path("/")
                                .maxAge(60 * 60)
                                .sameSite("Lax")
                                .build();

                response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
                return ApiResponse.success();
        }
}
