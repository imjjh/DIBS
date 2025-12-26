package com.imjjh.Dibs.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record LoginRequestDto(
    @Schema(description = "유저 아이디", example = "test1234")
    String username,

    @Schema(description = "유저 비밀번호", example = "Test1234!@")
    String password
){}
