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

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "판매자 권한 신청 관련 API", description = "판매자 권한 신청 및 관리자 승인/목록 조회 기능을 제공합니다.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SellerApplicationController {

    private final SellerApplicationService sellerApplicationService;

    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "판매자 권한 신청", description = "일반 유저가 판매자 권한을 신청합니다. 거절된 경우 재신청이 가능합니다.")
    @PostMapping("/seller/apply")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Void> createSellerApplication(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody SellerApplicationRequestDto requestDto) {
        sellerApplicationService.createSellerApplication(userDetails, requestDto);
        return ApiResponse.success();
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "판매자 신청 현황 조회", description = "현재 로그인한 유저의 판매자 신청 상태를 확인합니다.")
    @GetMapping("/seller/my-application")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<SellerApplicationResponseDto> getSellerApplication(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ApiResponse.success(sellerApplicationService.getSellerApplication(userDetails));
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "판매자 신청 심사", description = "관리자가 판매자 신청을 승인하거나 거절합니다.")
    @PatchMapping("/admin/seller/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> reviewSellerApplication(@PathVariable("id") Long id,
            @Valid @RequestBody SellerApplicationReviewRequestDto requestDto) {
        sellerApplicationService.reviewSellerApplication(id, requestDto);
        return ApiResponse.success();
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "판매자 신청 목록 검색", description = "관리자가 모든 판매자 신청 목록을 조회하고 필터링합니다.")
    @GetMapping("/admin/seller-applications")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PagedResponse<SellerApplicationResponseDto>> getSellerApplications(
            @ModelAttribute SellerApplicationSearchRequestDto requestDto) {
        return ApiResponse.success(sellerApplicationService.searchApplications(requestDto));
    }
}
