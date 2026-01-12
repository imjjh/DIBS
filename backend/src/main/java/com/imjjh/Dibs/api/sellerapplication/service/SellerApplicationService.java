package com.imjjh.Dibs.api.sellerapplication.service;

import com.imjjh.Dibs.api.sellerapplication.dto.*;
import com.imjjh.Dibs.api.sellerapplication.entity.ApplicationStatus;
import com.imjjh.Dibs.api.sellerapplication.entity.SellerApplicationEntity;
import com.imjjh.Dibs.api.sellerapplication.repository.SellerApplicationRepository;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.auth.user.RoleType;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.auth.user.repository.UserRepository;
import com.imjjh.Dibs.common.dto.PagedResponse;
import com.imjjh.Dibs.common.exception.ResourceNotFoundException;
import com.imjjh.Dibs.common.exception.UserNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SellerApplicationService {

    private final SellerApplicationRepository sellerApplicationRepository;
    private final UserRepository userRepository;

    /**
     * 일반 유저의 판매자 신청서 작성
     * 
     * @param userDetails
     * @param requestDto
     */
    @Transactional
    public void createSellerApplication(CustomUserDetails userDetails, @Valid SellerApplicationRequestDto requestDto) {
        SellerApplicationEntity entity = requestDto.toEntity(userDetails.getUserEntity());
        sellerApplicationRepository.save(entity);
    }

    /**
     * 일반 유저의 판매자 신청 현황 조회
     * 
     * @param userDetails
     * @return
     */
    @Transactional(readOnly = true)
    public SellerApplicationResponseDto getSellerApplication(CustomUserDetails userDetails) {
        Long userId = Long.valueOf(userDetails.getName());

        SellerApplicationEntity sellerApplicationEntity = sellerApplicationRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("신청 내역을 찾을 수 없습니다."));

        return SellerApplicationResponseDto.of(sellerApplicationEntity);
    }

    /**
     * 관리자의 특정 판매 신청서 승인 또는 거절
     * 
     * @param applicationId
     * @param requestDto
     * @return
     */
    @Transactional
    public void reviewSellerApplication(Long applicationId, @Valid SellerApplicationApproveRequestDto requestDto) {

        SellerApplicationEntity sellerApplicationEntity = sellerApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("판매 신청서를 찾을 수 없습니다."));

        UserEntity userEntity = userRepository.findById(sellerApplicationEntity.getUser().getId())
                .orElseThrow(() -> new UserNotFoundException("신청자를 찾을 수 없습니다."));

        // 이미 처리한 신청이라면 return
        if (!sellerApplicationEntity.getApplicationStatus().equals(ApplicationStatus.PENDING)) {
            return;
        }

        // 승인 처리
        if (requestDto.approve()) {
            sellerApplicationEntity.approve();
            // 판매자 권한 추가
            userEntity.addRole(RoleType.SELLER);
        } else {
            sellerApplicationEntity.reject(requestDto.rejectReason());
        }

    }

    @Transactional(readOnly = true)
    public PagedResponse<SellerApplicationResponseDto> searchApplications(
            SellerApplicationSearchRequestDto requestDto) {

        Page<SellerApplicationResponseDto> pageResult = sellerApplicationRepository.search(requestDto,
                requestDto.toPageable());

        return PagedResponse.of(pageResult);
    }

}
