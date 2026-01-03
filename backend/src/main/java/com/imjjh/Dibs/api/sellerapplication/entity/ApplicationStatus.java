package com.imjjh.Dibs.api.sellerapplication.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ApplicationStatus {
    PENDING("대기 중"),
    APPROVED("승인"),
    REJECTED("거절");

    private final String status;
}
