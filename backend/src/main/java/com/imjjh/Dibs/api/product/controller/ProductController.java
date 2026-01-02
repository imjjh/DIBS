package com.imjjh.Dibs.api.product.controller;

import com.imjjh.Dibs.api.product.dto.ProductDetailResponseDto;
import com.imjjh.Dibs.api.product.dto.request.ProductSearchRequestDto;
import com.imjjh.Dibs.api.product.dto.response.ProductListResponseDto;
import com.imjjh.Dibs.api.product.service.ProductService;
import com.imjjh.Dibs.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "상품 검색")
    public ResponseEntity<ApiResponse<ProductListResponseDto>> search(@ModelAttribute ProductSearchRequestDto requestDto) {
        ProductListResponseDto responseDto = productService.search(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of("상품 검색 성공", responseDto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "특정 상품 상세 정보")
    public ResponseEntity<ApiResponse<ProductDetailResponseDto>> getProduct(@PathVariable("id") Long id) {
        ProductDetailResponseDto responseDto= productService.getProduct(id);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of("상품 상세 정보 조회 성공", responseDto));
    }
}
