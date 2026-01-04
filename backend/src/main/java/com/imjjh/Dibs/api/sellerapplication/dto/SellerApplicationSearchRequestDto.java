package com.imjjh.Dibs.api.sellerapplication.dto;

import io.swagger.v3.oas.annotations.media.Schema;


public record SellerApplicationSearchRequestDto(
        @Schema(description = "페이지", example = "1")
        Integer page,

        @Schema(description = "한 페이지당 보여줄 컨텐츠의 갯수", example = "10")
        Integer size
) {
}
