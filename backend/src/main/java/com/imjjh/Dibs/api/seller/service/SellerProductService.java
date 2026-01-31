package com.imjjh.Dibs.api.seller.service;

import com.imjjh.Dibs.api.product.dto.request.ProductSearchRequestDto;
import com.imjjh.Dibs.api.product.dto.response.ProductSimpleResponseDto;
import com.imjjh.Dibs.api.product.repository.ProductRepository;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.common.dto.PagedResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SellerProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public PagedResponse<ProductSimpleResponseDto> searchBySeller(CustomUserDetails userDetails, @Valid ProductSearchRequestDto requestDto) {
        Long sellerId = userDetails.getNameLong();
        Page<ProductSimpleResponseDto> pageResult = productRepository.search(requestDto,sellerId, requestDto.toPageable());
        return PagedResponse.of(pageResult);
    }
}
