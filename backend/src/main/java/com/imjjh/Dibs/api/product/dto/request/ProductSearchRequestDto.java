package com.imjjh.Dibs.api.product.dto.request;

import com.imjjh.Dibs.common.dto.PageableRequest;
import io.swagger.v3.oas.annotations.media.Schema;

public record ProductSearchRequestDto(
                @Override @Schema(description = "페이지", example = "1") Integer page,

                @Override @Schema(description = "한 페이지당 보여줄 컨텐츠의 갯수", example = "10") Integer size,

                @Schema(description = "검색어 필드의 값", example = "갤럭시") String keyword,

                @Schema(description = "카테고리 필드", example = "노트북") String category

) implements PageableRequest {
}