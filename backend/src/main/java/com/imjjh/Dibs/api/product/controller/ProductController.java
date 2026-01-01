package com.imjjh.Dibs.api.product.controller;

import com.imjjh.Dibs.api.product.dto.request.ProductSearchRequestDto;
import com.imjjh.Dibs.api.product.dto.response.ProductListResponseDto;
import com.imjjh.Dibs.api.product.service.ProductService;
import com.imjjh.Dibs.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "상품 검색")
    public ResponseEntity<ApiResponse<ProductListResponseDto>> search(@ModelAttribute ProductSearchRequestDto requestDto) {
        ProductListResponseDto resposeDto = productService.search(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of("상품 검색 성공",resposeDto));
    }



}
