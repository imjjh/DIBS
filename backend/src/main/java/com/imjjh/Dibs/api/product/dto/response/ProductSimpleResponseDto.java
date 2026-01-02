package com.imjjh.Dibs.api.product.dto.response;

import com.imjjh.Dibs.api.product.entity.StatusType;

public record ProductSimpleResponseDto(
                Long id,
                String name,
                Long price,
                StatusType status,
                String imageUrl,
                String category,
                Integer discountRate

) {
}
