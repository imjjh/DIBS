package com.imjjh.Dibs.api.product.repository;

import com.imjjh.Dibs.api.product.dto.request.ProductSearchRequestDto;
import com.imjjh.Dibs.api.product.dto.response.ProductSimpleResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductRepositoryCustom {
    public Page<ProductSimpleResponseDto> search(ProductSearchRequestDto requestDto, Pageable pageable);
}
