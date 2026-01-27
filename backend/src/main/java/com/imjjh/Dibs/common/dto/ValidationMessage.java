package com.imjjh.Dibs.common.dto;

public class ValidationMessage {
    public static final String SUCCESS = "OK";

    // 공통 검증
    public static final String NOT_BLANK = "필수 입력 값입니다.";
    public static final String INVALID_EMAIL = "이메일 형식이 올바르지 않습니다.";

    // 인증 관련 검증 (DTO용)
    public static class Auth {
        public static final String USERNAME_FORMAT = "아이디는 영문 대소문자와 숫자만 사용 가능합니다.";
        public static final String USERNAME_SIZE = "유저 아이디는 4자 이상 20자 이하로 입력해주세요.";
        public static final String PASSWORD_SIZE = "비밀번호는 8자 이상 20자 이하로 입력해주세요.";
        public static final String PASSWORD_FORMAT = "비밀번호는 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.";
    }
}