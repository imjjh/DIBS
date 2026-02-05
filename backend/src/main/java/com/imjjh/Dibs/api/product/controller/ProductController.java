package com.imjjh.Dibs.api.product.controller;

import com.imjjh.Dibs.api.product.dto.request.ProductCreateRequestDto;
import com.imjjh.Dibs.api.product.dto.request.ProductSearchRequestDto;
import com.imjjh.Dibs.api.product.dto.request.ProductUpdateRequestDto;
import com.imjjh.Dibs.api.product.dto.response.ProductDetailResponseDto;
import com.imjjh.Dibs.api.product.dto.response.ProductSimpleResponseDto;
import com.imjjh.Dibs.api.product.service.ProductService;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.common.dto.ApiResponse;
import com.imjjh.Dibs.common.dto.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "상품 관련 API", description = "모든 사용자가 접근 가능한 상품 조회 및 구매/장바구니 기능을 제공합니다.")
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "상품 검색")
    public ApiResponse<PagedResponse<ProductSimpleResponseDto>> search(
            @ModelAttribute ProductSearchRequestDto requestDto) {
        return ApiResponse.success(productService.search(requestDto));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "특정 상품 상세 정보")
    public ApiResponse<ProductDetailResponseDto> getProduct(@PathVariable("id") Long id) {
        return ApiResponse.success(productService.getProduct(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "상품 등록")
    @PreAuthorize("hasRole('SELLER')")
    public ApiResponse<ProductDetailResponseDto> createProduct(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid ProductCreateRequestDto requestDto) {
        return ApiResponse.success(productService.createProduct(userDetails, requestDto));
    }

    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "상품 수정")
    public ApiResponse<ProductDetailResponseDto> updateProduct(
            @AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable("id") Long id,
            @RequestBody @Valid ProductUpdateRequestDto requestDto) {
        return ApiResponse.success(productService.updateProduct(userDetails, id, requestDto));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "상품 삭제")
    public ApiResponse<Void> deleteProduct(@AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("id") Long id) {
        productService.deleteProduct(userDetails, id);
        return ApiResponse.success();
    }
}
