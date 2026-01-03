package com.imjjh.Dibs.api.sellerapplication.dto;

import com.imjjh.Dibs.api.sellerapplication.entity.SellerApplicationEntity;
import com.imjjh.Dibs.auth.user.UserEntity;
import io.swagger.v3.oas.annotations.media.Schema;

public record SellerApplicationRequestDto(
        @Schema(description = "상호명")
        String businessName,
        @Schema(description = "사업자 번호 (Mock)")
        String businessNumber) {

    public SellerApplicationEntity toEntity(UserEntity user) {
        return  SellerApplicationEntity.builder()
                .user(user)
                .businessName(this.businessName)
                .businessNumber(this.businessNumber)
                .build();
    }
}
