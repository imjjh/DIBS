package com.imjjh.Dibs.api.product.controller;

import com.imjjh.Dibs.api.product.dto.request.ProductCreateRequestDto;
import com.imjjh.Dibs.api.product.dto.request.ProductSearchRequestDto;
import com.imjjh.Dibs.api.product.dto.request.ProductUpdateRequestDto;
import com.imjjh.Dibs.api.product.dto.response.ProductDetailResponseDto;
import com.imjjh.Dibs.api.product.dto.response.ProductSimpleResponseDto;
import com.imjjh.Dibs.api.product.service.ProductService;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.common.dto.ApiResponse;
import com.imjjh.Dibs.common.dto.ValidationMessage;
import com.imjjh.Dibs.common.dto.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "상품 검색")
    public ResponseEntity<ApiResponse<PagedResponse<ProductSimpleResponseDto>>> search(
            @ModelAttribute ProductSearchRequestDto requestDto) {
        PagedResponse<ProductSimpleResponseDto> responseDto = productService.search(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of(ValidationMessage.SUCCESS, responseDto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "특정 상품 상세 정보")
    public ResponseEntity<ApiResponse<ProductDetailResponseDto>> getProduct(@PathVariable("id") Long id) {
        ProductDetailResponseDto responseDto = productService.getProduct(id);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of(ValidationMessage.SUCCESS, responseDto));
    }

    @PostMapping
    @Operation(summary = "상품 등록")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ApiResponse<ProductDetailResponseDto>> createProduct(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid ProductCreateRequestDto requestDto) {
        ProductDetailResponseDto responseDto = productService.createProduct(userDetails, requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of(ValidationMessage.SUCCESS, responseDto));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "상품 수정")
    public ResponseEntity<ApiResponse<ProductDetailResponseDto>> updateProduct(
            @AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable("id") Long id,
            @RequestBody @Valid ProductUpdateRequestDto requestDto) {
        ProductDetailResponseDto responseDto = productService.updateProduct(userDetails, id, requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of(ValidationMessage.SUCCESS, responseDto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "상품 삭제")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("id") Long id) {
        productService.deleteProduct(userDetails, id);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of(ValidationMessage.SUCCESS, null));
    }

    @PostMapping("/{id}/buy")
    @Operation(summary = "상품 구매")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> buyProduct(@AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("id") Long id) {
        productService.buyProduct(userDetails, id);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of(ValidationMessage.SUCCESS, null));
    }

    @PostMapping("/{id}/cart")
    @Operation(summary = "상품 장바구니 추가")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> addToCart(@AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("id") Long id) {
        productService.addToCart(userDetails, id);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of(ValidationMessage.SUCCESS, null));
    }
}
