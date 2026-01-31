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

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

        private final JwtTokenProvider jwtTokenProvider;
        private final RefreshTokenRepository refreshTokenRepository;
        private final AuthService authService;

        @PostMapping("/validateUsername")
        @ResponseStatus(HttpStatus.OK)
        public ApiResponse<Void> validateUsername(
                        @Valid @RequestBody ValidUsernameRequestDto requestDto) {
                authService.validateUsername(requestDto.username());
                return ApiResponse.success();
        }

        @PostMapping("/validateEmail")
        @ResponseStatus(HttpStatus.OK)
        public ApiResponse<Void> validateEmail(@Valid @RequestBody ValidEmailRequestDto requestDto) {
                authService.validateEmail(requestDto.email());
                return ApiResponse.success();
        }

        @PostMapping("/register")
        @ResponseStatus(HttpStatus.CREATED)
        public ApiResponse<Void> register(@Valid @RequestBody RegisterRequestDto requestDto) {
                authService.register(requestDto);
                return ApiResponse.success();
        }

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

        /**
         * 로그인 상태를 확인하고 로그인된 상태라면 유저 정보를 반환합니다.
         *
         * @param userDetails
         * @return 로그인 ? 유저 정보 : null
         */
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

        /**
         * 로그아웃 메서드
         * accessToken 쿠키를 덮어써 기존 쿠키를 제거합니다.
         * TODO: blackList, refresh 쿠키 & redis에서 제거
         *
         * @return
         */
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
