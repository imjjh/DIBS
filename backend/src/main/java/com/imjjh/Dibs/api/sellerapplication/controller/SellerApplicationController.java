package com.imjjh.Dibs.api.sellerapplication.controller;

import com.imjjh.Dibs.api.sellerapplication.dto.*;
import com.imjjh.Dibs.api.sellerapplication.service.SellerApplicationService;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.common.dto.ApiResponse;
import com.imjjh.Dibs.common.dto.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SellerApplicationController {

    private final SellerApplicationService sellerApplicationService;

    @ResponseStatus(HttpStatus.CREATED)
    @Operation(description = "일반 유저의 판매자 권한 신청 (재신청 포함)")
    @PostMapping("/seller/apply")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Void> createSellerApplication(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody SellerApplicationRequestDto requestDto) {
        sellerApplicationService.createSellerApplication(userDetails, requestDto);
        return ApiResponse.success();
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(description = "일반 유저의 판매자 신청 현황 조회")
    @GetMapping("/seller/my-application")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<SellerApplicationResponseDto> getSellerApplication(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ApiResponse.success(sellerApplicationService.getSellerApplication(userDetails));
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(description = "관리자가 판매자 신청 승인 또는 거절")
    @PatchMapping("/admin/seller/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> reviewSellerApplication(@PathVariable("id") Long id,
            @Valid @RequestBody SellerApplicationReviewRequestDto requestDto) {
        sellerApplicationService.reviewSellerApplication(id, requestDto);
        return ApiResponse.success();
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(description = "관리자의 신청 목록 검색")
    @GetMapping("/admin/seller-applications")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PagedResponse<SellerApplicationResponseDto>> getSellerApplications(
            @ModelAttribute SellerApplicationSearchRequestDto requestDto) {
        return ApiResponse.success(sellerApplicationService.searchApplications(requestDto));
    }
}
