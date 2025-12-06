package com.imjjh.TicketLock.user;


import lombok.Getter;
import lombok.RequiredArgsConstructor;


/**
 * ROLE 정보 정의
 *
 */
@Getter
@RequiredArgsConstructor
public enum RoleType {

    ADMIN ("ROLE_ADMIN","관리자"), // 관리자
    USER("ROLE_USER","일반 사용자"), // 일반 가입시
    SELLER("ROLE_SELLER","판매자"); // 판매자

    private final String key;
    private final String title;
}
