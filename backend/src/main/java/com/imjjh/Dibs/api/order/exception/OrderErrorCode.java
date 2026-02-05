package com.imjjh.Dibs.api.order.exception;

import com.imjjh.Dibs.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum OrderErrorCode implements ErrorCode {
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "주문을 찾을 수 없습니다."),
    ORDER_TRAFFIC_EXCEEDED(HttpStatus.INTERNAL_SERVER_ERROR, "주문량이 많아 현재 처리할 수 없습니다. 잠시 후 다시 시도해주세요."),
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");

    private final HttpStatus status;
    private final String message;
}
