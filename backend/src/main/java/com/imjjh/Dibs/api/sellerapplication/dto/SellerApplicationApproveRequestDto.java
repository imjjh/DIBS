package com.imjjh.Dibs.api.sellerapplication.dto;

public record SellerApplicationApproveRequestDto(
        boolean approve,
        String rejectReason) {
}
