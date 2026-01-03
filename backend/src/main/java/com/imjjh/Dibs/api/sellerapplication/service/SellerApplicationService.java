package com.imjjh.Dibs.api.sellerapplication.service;

import com.imjjh.Dibs.api.sellerapplication.dto.*;
import com.imjjh.Dibs.api.sellerapplication.entity.SellerApplicationEntity;
import com.imjjh.Dibs.api.sellerapplication.repository.SellerApplicationRepository;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.common.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.hibernate.metamodel.spi.RuntimeMetamodelsImplementor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class SellerApplicationService {
    private final SellerApplicationRepository sellerApplicationRepository;

    @Transactional
    public void createSellerApplication(CustomUserDetails userDetails, @Valid SellerApplicationRequestDto requestDto) {
        SellerApplicationEntity entity = requestDto.toEntity(userDetails.getUserEntity());
        sellerApplicationRepository.save(entity);
    }

    @Transactional(readOnly = true)
    public SellerApplicationResponseDto getSellerApplication(CustomUserDetails userDetails) {
        Long userId = Long.valueOf(userDetails.getName());

        SellerApplicationEntity sellerApplicationEntity = sellerApplicationRepository.findByUserId(userId)
                .orElseThrow(()-> new ResourceNotFoundException("신청 내역을 찾을 수 없습니다."));

        return SellerApplicationResponseDto.of(sellerApplicationEntity);
    }

    @Transactional
    public void approveSellerApplication(Long applicationId, @Valid SellerApplicationApproveReqeustDto requestDto) {

    }


    public SellerApplicationListResponseDto getSellerApplications(SellerApplicationSearchRequestDto requestDto) {
        
    }
}
