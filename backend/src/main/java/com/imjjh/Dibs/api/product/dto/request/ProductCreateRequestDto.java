package com.imjjh.Dibs.api.product.dto.request;

import lombok.Builder;

@Builder
public record ProductCreateRequestDto(
        String name,

        String description,

        Long price,

        Integer stockQuantity,

        String imageUrl,

        String category

) {
}
