package com.imjjh.Dibs.api.product.entity;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum StatusType {
    ON_SALE("판매 중"),
    SOLD_OUT("품절"),
    RESERVED("예약 중");

    private final String description;
}
