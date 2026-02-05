package com.imjjh.Dibs.api.cartItem.dto.request;

import com.imjjh.Dibs.common.dto.PageableRequest;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "장바구니 페이징 요청")
public record CartItemPageRequestDto(
                @Override @Schema(description = "페이지 번호 (1-based)", example = "1") Integer page,

                @Override @Schema(description = "페이지 크기", example = "10") Integer size) implements PageableRequest {
}
