package com.imjjh.Dibs.auth.dto;

import com.imjjh.Dibs.auth.user.UserEntity;

/**
 * AuthService, AuthController 계층간 통신을 위한 dto
 * @param accessToken
 * @param refreshToken
 * @param user
 */
public record LoginResponseDto(
    String accessToken,
    String refreshToken,
    UserEntity user
) {
}