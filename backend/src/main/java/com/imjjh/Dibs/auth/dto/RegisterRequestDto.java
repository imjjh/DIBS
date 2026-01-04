package com.imjjh.Dibs.auth.dto;

import com.imjjh.Dibs.auth.user.UserEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequestDto(

        @Schema(description = "유저 아이디", example = "test1234") @NotBlank(message = "아이디는 필수 입력 값입니다.") @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "아이디는 특수문자 없이 영문 대소문자와 숫자만 사용 가능합니다.") @Size(min = 4, max = 20, message = "유저 아이디는 4자 이상 20자 이하로 입력해주세요.") String username,

        @Schema(description = "유저 비밀번호", example = "Test1234!@") @NotBlank(message = "비밀번호는 필수 입력 값입니다.") @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", message = "비밀번호는 8자 이상이어야 하며, 영문 대문자, 소문자, 숫자, 특수문자(@$!%*?&)를 각각 하나 이상 포함해야 합니다.") String password,

        @Schema(description = "유저 이름", example = "장준호") @NotBlank(message = "유저 이름은 필수 입력 값입니다.") String nickname,

        @Schema(description = "유저 이메일", example = "test123@test.com") @Email(message = "이메일 형식이 올바르지 않습니다.") String email) {
    public static UserEntity toEntity(RegisterRequestDto requestDto) {
        return UserEntity.builder()
                .email(requestDto.email())
                .nickname(requestDto.nickname())
                .username(requestDto.username())
                .build();
    }
}
