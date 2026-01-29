package com.imjjh.Dibs.api.product.dto.request;

import com.imjjh.Dibs.api.product.entity.StatusType;
import lombok.Builder;

@Builder
public record ProductUpdateRequestDto(
        String name,
        String description,
        Long price,
        Integer stockQuantity,
        String imageUrl,
        String category,
        StatusType status) {
}