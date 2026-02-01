package com.imjjh.Dibs.api.cartItem.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "장바구니 아이템 생성 요청")
public record CartItemCreateRequestDto(
        @Schema(description = "상품 ID") Long productId,

        @Schema(description = "추가할 수량") Long quantity) {
}
