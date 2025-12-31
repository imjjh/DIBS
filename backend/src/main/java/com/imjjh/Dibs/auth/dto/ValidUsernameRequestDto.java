package com.imjjh.Dibs.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * 사용 중인 ID 확인
 * @param username
 */
public record ValidUsernameRequestDto(
        @Schema(description = "유저 아이디", example = "test1234") @NotBlank(message = "아이디는 필수 입력 값입니다.") @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "아이디는 특수문자 없이 영문 대소문자와 숫자만 사용 가능합니다.") @Size(min = 4, max = 20, message = "유저 아이디는 4자 이상 20자 이하로 입력해주세요.")
        String username
) { }
