package com.imjjh.Dibs.api.order.dto.response;

import com.imjjh.Dibs.api.order.entity.OrderStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Schema(description = "주문 상세 조회 응답 DTO")
public record OrderDetailResponseDto(
                @Schema(description = "주문 ID") @NotNull Long id,

                @Schema(description = "주문명") @NotBlank String orderName,

                @Schema(description = "총 주문 금액") @NotNull Long totalPrice,

                @Schema(description = "주문 상태") @NotNull OrderStatus status,

                @Schema(description = "주문 상태 설명") @NotBlank String statusDescription,

                @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") @Schema(description = "주문 일시") @NotNull LocalDateTime orderedAt,

                @Schema(description = "수령인 이름") @NotBlank String recipientName,

                @Schema(description = "수령인 전화번호") @NotBlank String recipientPhone,

                @Schema(description = "배송지 주소") @NotBlank String shippingAddress,

                @Schema(description = "배송지 상세 주소") @NotBlank String shippingAddressDetail,

                @Schema(description = "우편번호") @NotBlank String zipCode,

                @Schema(description = "배송 메모") String deliveryMemo,

                @Schema(description = "주문 상품 목록") @NotNull List<OrderItemResponseDto> orderItems) {
        @Builder
        @Schema(description = "주문 상품 상세 정보")
        public record OrderItemResponseDto(
                        @Schema(description = "상품 ID") @NotNull Long productId,

                        @Schema(description = "상품명") @NotBlank String productName,

                        @Schema(description = "주문 수량") @NotNull Long quantity,

                        @Schema(description = "주문 당시 가격") @NotNull Long price,

                        @Schema(description = "총 가격 (수량 * 가격)") @NotNull Long totalPrice,

                        @Schema(description = "상품 이미지 URL") String imageUrl,

                        @Schema(description = "상품 판매 상태") String productStatus,

                        @Schema(description = "판매자 이름") String sellerName) {
        }
}
