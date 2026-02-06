package com.imjjh.Dibs.api.order.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
@Schema(description = "주문 목록 조회 응답 DTO")
public record OrderSimpleResponseDto(
                @Schema(description = "주문 ID") @NotNull Long id,

                @Schema(description = "주문명", example = "나이키 신발 외 2건") @NotBlank String orderName,

                @Schema(description = "총 주문 금액") @NotNull Long totalPrice,

                @Schema(description = "주문 상태") @NotNull String status,

                @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") @Schema(description = "주문 일시") @NotNull LocalDateTime orderedAt,

                @Schema(description = "대표 상품 이미지 URL") String representativeImageUrl) {
}
