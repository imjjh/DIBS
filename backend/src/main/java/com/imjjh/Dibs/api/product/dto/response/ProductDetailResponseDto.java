package com.imjjh.Dibs.api.product.dto.response;

import lombok.Builder;

@Builder
public record ProductDetailResponseDto(
                Long id,

                String sellerName,

                String name,

                String description,

                Long price,

                Long stockQuantity,

                String status,

                String imageUrl,

                String category,

                Long specialPrice,

                Integer discountRate) {
}
