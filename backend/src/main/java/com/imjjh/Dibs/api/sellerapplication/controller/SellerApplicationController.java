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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SellerApplicationController {

    private final SellerApplicationService sellerApplicationService;

    @Operation(description = "일반 유저의 판매자 권한 신청")
    @PostMapping("/seller/apply")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> createSellerApplication(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody SellerApplicationRequestDto requestDto) {
        sellerApplicationService.createSellerApplication(userDetails, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of("판매자 신청 완료", null));
    }

    @Operation(description = "일반 유저의 판매자 신청 현황 조회")
    @GetMapping("/seller/my-application")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<SellerApplicationResponseDto>> getSellerApplication(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        SellerApplicationResponseDto responseDto = sellerApplicationService.getSellerApplication(userDetails);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of("판매자 신청 현황", responseDto));
    }

    @Operation(description = "관리자가 판매자 신청 승인")
    @PatchMapping("/admin/seller/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> approveSellerApplication(@PathVariable("id") Long id,
            @Valid @RequestBody SellerApplicationApproveRequestDto requestDto) {
        sellerApplicationService.approveSellerApplication(id, requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of("판매자 승인 완료", null));
    }

    @Operation(description = "관리자의 신청 목록 검색")
    @GetMapping("/admin/seller-applications")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<SellerApplicationResponseDto>>> getSellerApplications(
            @ModelAttribute SellerApplicationSearchRequestDto requestDto) {
        PagedResponse<SellerApplicationResponseDto> responseDto = sellerApplicationService.searchApplications(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of("신청 목록 조회 성공", responseDto));
    }
}
