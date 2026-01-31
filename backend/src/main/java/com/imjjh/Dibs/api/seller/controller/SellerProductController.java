package com.imjjh.Dibs.api.seller.controller;

import com.imjjh.Dibs.api.product.dto.request.ProductSearchRequestDto;
import com.imjjh.Dibs.api.product.dto.response.ProductSimpleResponseDto;
import com.imjjh.Dibs.api.seller.service.SellerProductService;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.common.dto.ApiResponse;
import com.imjjh.Dibs.common.dto.PagedResponse;
import com.imjjh.Dibs.common.dto.ValidationMessage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "판매자 상품 관련 API", description = "")
@RestController
@RequestMapping("/api/seller/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SELLER')")
public class SellerProductController {

    private final SellerProductService sellerProductService;

    @GetMapping
    @Operation(summary = "내 상품 목록 조회", description = "판매자가 자신이 등록한 상품만 조회합니다.")
    public ResponseEntity<ApiResponse<PagedResponse<ProductSimpleResponseDto>>> myProduct(@AuthenticationPrincipal CustomUserDetails userDetails, @ModelAttribute @Valid ProductSearchRequestDto requestDto) {
        Long userId = userDetails.getNameLong();
        PagedResponse<ProductSimpleResponseDto> response = sellerProductService.searchBySeller(userDetails,requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of(ValidationMessage.SUCCESS,response));
    }
}
