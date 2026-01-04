package com.imjjh.Dibs.api.sellerapplication.repository;

import com.imjjh.Dibs.api.sellerapplication.dto.SellerApplicationResponseDto;
import com.imjjh.Dibs.api.sellerapplication.dto.SellerApplicationSearchRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SellerApplicationRepositoryCustom {
    Page<SellerApplicationResponseDto> search(SellerApplicationSearchRequestDto requestDto, Pageable pageable);

}
