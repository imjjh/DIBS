package com.imjjh.Dibs.api.product.dto;

import com.imjjh.Dibs.api.product.entity.ProductEntity;
import lombok.Builder;


@Builder
public record ProductDetailResponseDto(
        Long id,

        String sellerName,

        String name,

        String description,

        Long price,

        Integer stockQuantity,

        String status,

        String imageUrl,

        String category,

        Long specialPrice,

        Integer discountRate
) {

    public static ProductDetailResponseDto of(ProductEntity productEntity) {
        return ProductDetailResponseDto.builder()
                .id(productEntity.getId())
                .sellerName(productEntity.getSeller().getNickName())
                .name(productEntity.getName())
                .description(productEntity.getDescription())
                .price(productEntity.getPrice())
                .stockQuantity(productEntity.getStockQuantity())
                .status(productEntity.getStatus().getDescription())
                .imageUrl(productEntity.getImageUrl())
                .category(productEntity.getCategory())
                .specialPrice(productEntity.getSpecialPrice())
                .discountRate(productEntity.getDiscountRate())
                .build();
    }

}
