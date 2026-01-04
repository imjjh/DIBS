package com.imjjh.Dibs.api.sellerapplication.dto;

import com.imjjh.Dibs.api.sellerapplication.entity.SellerApplicationEntity;
import lombok.Builder;

@Builder
public record SellerApplicationResponseDto(
        Long id,

        Long userId,

        String businessName,

        String businessNumber,

        String status,

        String rejectReason
) {
    public static SellerApplicationResponseDto of(SellerApplicationEntity sellerApplicationEntity) {
        return SellerApplicationResponseDto.builder()
                .id(sellerApplicationEntity.getId())
                .userId(sellerApplicationEntity.getUser().getId())
                .businessName(sellerApplicationEntity.getBusinessName())
                .businessNumber(sellerApplicationEntity.getBusinessNumber())
                .status(sellerApplicationEntity.getApplicationStatus().getStatus())
                .rejectReason(sellerApplicationEntity.getRejectReason())
                .build();
    }
}
