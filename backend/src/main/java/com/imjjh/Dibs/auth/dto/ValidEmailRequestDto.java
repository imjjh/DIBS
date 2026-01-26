package com.imjjh.Dibs.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;

/**
 * 사용 중인 Email 확인
 * 
 * @param email
 */
public record ValidEmailRequestDto(
                @Schema(description = "유저 이메일", example = "test123@test.com") @Email(message = "이메일 형식이 올바르지 않습니다.") String email) {
}
