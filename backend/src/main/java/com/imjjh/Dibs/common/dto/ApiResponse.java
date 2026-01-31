package com.imjjh.Dibs.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponse<T> {
    private String message;
    private T data;

    public static <T> ApiResponse<T> of(String message, T data) {
        return new ApiResponse<>(message, data);
    }

    public static <T> ApiResponse<T> of(String message) {
        return new ApiResponse<>(message, null);
    }

    public static <T> ApiResponse<T> success() {
        return new ApiResponse<>(ValidationMessage.SUCCESS, null);
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(ValidationMessage.SUCCESS, data);
    }

}
