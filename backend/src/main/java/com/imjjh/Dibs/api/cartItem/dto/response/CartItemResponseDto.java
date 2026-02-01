package com.imjjh.Dibs.api.cartItem.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "장바구니 아이템 응답 DTO")
public record CartItemResponseDto(
        @Schema(description = "상품 ID") Long productId,

        @Schema(description = "상품명") String productName,

        @Schema(description = "상품 이미지 URL") String imageUrl,

        @Schema(description = "상품 가격 (개당)") Long price,

        @Schema(description = "담은 수량") Long quantity,

        @Schema(description = "판매자명") String sellerName) {
}
