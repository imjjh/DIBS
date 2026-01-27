package com.imjjh.Dibs.api.sellerapplication.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import com.imjjh.Dibs.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum SellerErrorCode implements ErrorCode {
    ALREADY_APPROVED(HttpStatus.BAD_REQUEST, "이미 승인된 신청입니다."),
    APPLICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "신청 내역을 찾을 수 없습니다."),
    REJECT_REASON_REQUIRED(HttpStatus.BAD_REQUEST, "거절 사유를 입력해 주세요."),
    DUPLICATE_BUSINESS_NUMBER(HttpStatus.CONFLICT, "이미 존재하는 사업자 번호입니다.");

    private final HttpStatus status;
    private final String message;
}
