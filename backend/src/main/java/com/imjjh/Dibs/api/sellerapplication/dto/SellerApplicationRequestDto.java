package com.imjjh.Dibs.api.sellerapplication.dto;

import com.imjjh.Dibs.api.sellerapplication.entity.SellerApplicationEntity;
import com.imjjh.Dibs.auth.user.UserEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record SellerApplicationRequestDto(
        @NotBlank
        @Schema(description = "상호명")
        String businessName,

        @NotBlank
        @Pattern(
                regexp = "^\\d{3}-\\d{2}-\\d{5}$",
                message = "올바른 사업자 번호 형식이 아닙니다. (예: 123-45-67890)"
        )
        @Schema(description = "사업자 번호")
        String businessNumber) {

    public SellerApplicationEntity toEntity(UserEntity user) {
        return  SellerApplicationEntity.builder()
                .user(user)
                .businessName(this.businessName)
                .businessNumber(this.businessNumber)
                .build();
    }
}
