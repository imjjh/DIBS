package com.imjjh.Dibs.api.order.dto.request;

import com.imjjh.Dibs.common.dto.ValidationMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record OrderCreateRequestDto(
                @Schema(description = "수령인 이름", example = "홍길동") @NotBlank(message = "수령인 이름은 필수입니다.") String recipientName,

                @Schema(description = "수령인 전화번호", example = "010-1234-5678") @NotBlank(message = "전화번호는 필수입니다.") String recipientPhone,

                @Schema(description = "배송 주소", example = "서울시 강남구 테헤란로 123") @NotBlank(message = "주소는 필수입니다.") String shippingAddress,

                @Schema(description = "상세 주소", example = "101동 101호") @NotBlank(message = "상세 주소는 필수입니다.") String shippingAddressDetail,

                @Schema(description = "우편번호", example = "12345") @NotBlank(message = "우편번호는 필수입니다.") String zipCode,

                @Schema(description = "배송 메모", example = "문 앞에 놔주세요.") String deliveryMemo,

                @Schema(description = "주문 상품 목록") List<OrderItemRequest> orderItems) {

        public record OrderItemRequest(@Schema(description = "상품 ID", example = "1") Long productId,

                        @Schema(description = "주문 수량", example = "2") @Min(value = 1, message = ValidationMessage.MIN_QUANTITY) Long quantity) {
        }
}
// @formatter:on
