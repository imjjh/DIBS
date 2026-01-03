package com.imjjh.Dibs.api.sellerapplication.dto;

import com.imjjh.Dibs.api.sellerapplication.entity.SellerApplicationEntity;
import lombok.Builder;

@Builder
public record SellerApplicationResponseDto(
        String businessName,

        String businessNumber,

        String status,

        String rejectReason
) {
    public static SellerApplicationResponseDto of(SellerApplicationEntity sellerApplicationEntity) {
        return SellerApplicationResponseDto.builder()
                .businessNumber(sellerApplicationEntity.getBusinessNumber())
                .businessName(sellerApplicationEntity.getBusinessName())
                .status(sellerApplicationEntity.getApplicationStatus().getStatus())
                .build();
    }
}
