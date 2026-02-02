package com.imjjh.Dibs.api.order.controller;

import com.imjjh.Dibs.api.order.dto.request.OrderCreateRequestDto;
import com.imjjh.Dibs.api.order.service.OrderService;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.common.dto.ApiResponse;
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

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "주문 생성 (가주문)")
    public ApiResponse<Void> createOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails, OrderCreateRequestDto requestDto) {
         orderService.createOrder(userDetails,requestDto);
        return ApiResponse.success();
    }

    @PostMapping("/{orderUid}/cancel")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "주문 취소")
    public ApiResponse<Void> cancelOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("orderId") Long orderId,
            @RequestParam("addToCart") Boolean addToCart) {
        orderService.cancelOrder(userDetails, orderId,addToCart);
        return ApiResponse.success();
    }
}
