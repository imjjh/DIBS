package com.imjjh.Dibs.api.order.dto.request;

import com.imjjh.Dibs.common.dto.PageableRequest;

import io.swagger.v3.oas.annotations.media.Schema;

public record OrderSearchRequestDto(

        @Override @Schema(description = "페이지", example = "1") Integer page,

        @Override @Schema(description = "한 페이지당 보여줄 컨텐츠의 갯수", example = "10") Integer size

) implements PageableRequest {
}