package com.imjjh.Dibs.api.sellerapplication.dto;

public record SellerApplicationReviewRequestDto(
        boolean approve,
        String rejectReason) {
}
