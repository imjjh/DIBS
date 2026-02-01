package com.imjjh.Dibs.api.cartItem.controller;

import com.imjjh.Dibs.api.cartItem.dto.request.CartItemCreateRequestDto;
import com.imjjh.Dibs.api.cartItem.service.CartItemService;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.imjjh.Dibs.api.cartItem.dto.response.CartItemResponseDto;
import com.imjjh.Dibs.api.cartItem.dto.request.CartItemPageRequestDto;
import com.imjjh.Dibs.common.dto.PagedResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart-items")
@PreAuthorize("isAuthenticated()")
@Tag(name = "CartItem", description = "장바구니 API")
public class CartItemController {

    private final CartItemService cartItemService;

    @GetMapping
    @Operation(summary = "장바구니 아이템 목록 조회")
    public ApiResponse<PagedResponse<CartItemResponseDto>> getCartItems(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            CartItemPageRequestDto pageRequest) {
        return ApiResponse.success(cartItemService.getCartItems(userDetails, pageRequest.toPageable()));
    }

    @PostMapping

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "장바구니에 상품 추가")
    public ApiResponse<Void> createCartItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CartItemCreateRequestDto cartItemCreateRequestDto) {
        cartItemService.createCartItem(userDetails, cartItemCreateRequestDto);
        return ApiResponse.success();
    }

    @Operation(summary = "장바구니에서 상품 제거")
    @DeleteMapping("/{productId}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> deleteCartItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("productId") Long productId) {
        cartItemService.deleteCartItem(userDetails, productId);
        return ApiResponse.success();
    }

    @Operation(summary = "장바구니에서 특정 상품 업데이트")
    @PatchMapping("/{productId}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> updateCartItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("productId") Long productId,
            @RequestParam("quantity") Long quantity) {

        cartItemService.updateCartItem(userDetails, productId, quantity);
        return ApiResponse.success();
    }

}
