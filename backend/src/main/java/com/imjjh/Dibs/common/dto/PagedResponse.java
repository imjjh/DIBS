package com.imjjh.Dibs.common.dto;
import lombok.Builder;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * 페이징 처리가 완료된 데이터를 담는 범용 응답 객체
 */
@Builder
public record PagedResponse <T> (
    List<T> items,

    long totalElements,

    int totalPages,

    int page,

    int size
    )
{
    public static <T> PagedResponse<T> of(Page<T> pageResult) {
        return PagedResponse.<T>builder()
                .items(pageResult.getContent())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .page(pageResult.getNumber() + 1) // 현재 페이지 번호 (1-based 변환)
                .size(pageResult.getSize())
                .build();
    }
}
