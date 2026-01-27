package com.imjjh.Dibs.api.product.service;

import com.imjjh.Dibs.api.product.dto.ProductDetailResponseDto;
import com.imjjh.Dibs.api.product.dto.request.ProductSearchRequestDto;
import com.imjjh.Dibs.api.product.dto.response.ProductSimpleResponseDto;
import com.imjjh.Dibs.api.product.entity.ProductEntity;
import com.imjjh.Dibs.api.product.exception.ProductErrorCode;
import com.imjjh.Dibs.api.product.repository.ProductRepository;
import com.imjjh.Dibs.common.dto.PagedResponse;
import com.imjjh.Dibs.common.exception.BusinessException;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    /**
     * 상품 목록 검색
     * 
     * @param requestDto
     * @return
     */
    @Transactional(readOnly = true)
    public PagedResponse<ProductSimpleResponseDto> search(ProductSearchRequestDto requestDto) {

        Page<ProductSimpleResponseDto> pageResult = productRepository.search(requestDto, requestDto.toPageable());

        return PagedResponse.of(pageResult);
    }

    @Transactional(readOnly = true)
    public ProductDetailResponseDto getProduct(Long id) {
        ProductEntity productEntity = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ProductErrorCode.PRODUCT_NOT_FOUND));

        return ProductDetailResponseDto.of(productEntity);
    }
}
