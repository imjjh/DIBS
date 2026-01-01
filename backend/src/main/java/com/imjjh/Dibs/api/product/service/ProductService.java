package com.imjjh.Dibs.api.product.service;

import com.imjjh.Dibs.api.product.dto.request.ProductSearchRequestDto;
import com.imjjh.Dibs.api.product.dto.response.ProductListResponseDto;
import com.imjjh.Dibs.api.product.dto.response.ProductSimpleResponseDto;
import com.imjjh.Dibs.api.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    /**
     * 상품 목록 검색
     * @param requestDto
     * @return
     */
    @Transactional(readOnly = true)
    public ProductListResponseDto search(ProductSearchRequestDto requestDto) {

        int page = Optional.ofNullable(requestDto.page()).orElse(0);
        int size = Optional.ofNullable(requestDto.size()).orElse(10);

        Pageable pageable = PageRequest.of(page, size);

        Page<ProductSimpleResponseDto> pageResult = productRepository.search(requestDto, pageable);


        return ProductListResponseDto.builder()
                .items(pageResult.getContent())
                .page(pageResult.getNumber())
                .size(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .build();
    }

}
