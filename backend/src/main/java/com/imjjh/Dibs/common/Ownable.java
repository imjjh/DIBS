package com.imjjh.Dibs.common;

import com.imjjh.Dibs.auth.exception.AuthErrorCode;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.common.exception.BusinessException;

public interface Ownable {
    Long getOwnerId();

    default void validateOwner(CustomUserDetails userDetails) {
        // 관리자인 경우
        boolean isAdmin = userDetails.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin)
            return;

        // 주인이 일치하지 않는 경우
        if (!userDetails.getNameLong().equals(getOwnerId())) {
            throw new BusinessException(AuthErrorCode.ACCESS_DENIED);
        }

    }
}