package com.imjjh.Dibs.api.order.controller;

import com.imjjh.Dibs.api.order.dto.request.OrderCreateRequestDto;
import com.imjjh.Dibs.api.order.dto.request.OrderSearchRequestDto;
import com.imjjh.Dibs.api.order.dto.response.OrderDetailResponseDto;
import com.imjjh.Dibs.api.order.dto.response.OrderSimpleResponseDto;
import com.imjjh.Dibs.api.order.service.OrderFacade;
import com.imjjh.Dibs.api.order.service.OrderService;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.common.dto.ApiResponse;
import com.imjjh.Dibs.common.dto.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
@PreAuthorize("isAuthenticated()")
@Tag(name = "Order", description = "주문 API")
public class OrderController {

    private final OrderService orderService;
    private final OrderFacade orderFacade;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "주문 목록 조회")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<PagedResponse<OrderSimpleResponseDto>> searchOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails, @ModelAttribute OrderSearchRequestDto requestDto) {
        return ApiResponse.success(orderService.searchOrder(userDetails, requestDto));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "주문 상세 조회")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<OrderDetailResponseDto> searchOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable("id") Long id) {
        return ApiResponse.success(orderService.getOrder(userDetails, id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "주문 생성 (가주문)")
    public ApiResponse<Void> createOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody OrderCreateRequestDto requestDto) {
        orderFacade.createOrderWithLock(userDetails, requestDto);
        return ApiResponse.success();
    }

    @PostMapping("/{id}/cancel")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "주문 취소", description = "주문을 취소하고 상태를 변경합니다. (재고 복구)")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Void> cancelOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("id") Long orderId,
            @RequestParam(name="addToCart",defaultValue = "false") Boolean addToCart) {

        orderFacade.cancelOrderWithLock(userDetails, orderId, addToCart);
        return ApiResponse.success();
    }
}
