package com.imjjh.Dibs.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import com.imjjh.Dibs.common.dto.ValidationMessage;

/**
 * 사용 중인 ID 확인
 * 
 * @param username
 */
public record ValidUsernameRequestDto(
                @Schema(description = "유저 아이디", example = "test1234") @NotBlank(message = ValidationMessage.NOT_BLANK) @Pattern(regexp = "^[a-zA-Z0-9]+$", message = ValidationMessage.Auth.USERNAME_FORMAT) @Size(min = 4, max = 20, message = ValidationMessage.Auth.USERNAME_SIZE) String username) {
}
