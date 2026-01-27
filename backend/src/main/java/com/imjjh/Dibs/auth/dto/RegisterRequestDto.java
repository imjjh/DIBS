package com.imjjh.Dibs.auth.dto;

import com.imjjh.Dibs.auth.user.UserEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import com.imjjh.Dibs.common.dto.ValidationMessage;

@Builder
public record RegisterRequestDto(

        @Schema(description = "유저 아이디", example = "test1234") @NotBlank(message = ValidationMessage.NOT_BLANK) @Pattern(regexp = "^[a-zA-Z0-9]+$", message = ValidationMessage.Auth.USERNAME_FORMAT) @Size(min = 4, max = 20, message = ValidationMessage.Auth.USERNAME_SIZE) String username,

        @Schema(description = "유저 비밀번호", example = "Test1234!@") @NotBlank(message = ValidationMessage.NOT_BLANK) @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", message = ValidationMessage.Auth.PASSWORD_FORMAT) String password,

        @Schema(description = "유저 이름", example = "장준호") @NotBlank(message = ValidationMessage.NOT_BLANK) String nickname,

        @Schema(description = "유저 이메일", example = "test123@test.com") @Email(message = ValidationMessage.INVALID_EMAIL) String email) {
    public static UserEntity toEntity(RegisterRequestDto requestDto) {
        return UserEntity.builder()
                .email(requestDto.email())
                .nickname(requestDto.nickname())
                .username(requestDto.username())
                .build();
    }
}
