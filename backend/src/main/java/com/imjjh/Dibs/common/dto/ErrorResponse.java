package com.imjjh.Dibs.common.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ErrorResponse {
    private String error;
    private String message;
    private String path;
    private String timestamp;

    public static ErrorResponse of(String error, String message, String path) {
        return ErrorResponse.builder()
                .error(error)
                .message(message)
                .path(path)
                .timestamp (LocalDateTime.now().toString()) // String으로 변환 // objectMapper에서 사용 @LocalDateTime 사용 불가
                .build();
    }

}
