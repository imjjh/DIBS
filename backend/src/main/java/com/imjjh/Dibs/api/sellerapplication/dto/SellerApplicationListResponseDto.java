package com.imjjh.Dibs.api.sellerapplication.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.util.List;

@Builder
public record SellerApplicationListResponseDto(
        @Schema(description = "각 상품의 정보를 담은 List")
        List<SellerApplicationResponseDto> items,
        Long totalElements, // 총 상품 목록의 수
        int page, // 현재 페이지 번호
        int size, // 페이지 크기
        int totalPages // 전체 페이지 수
) {
}
