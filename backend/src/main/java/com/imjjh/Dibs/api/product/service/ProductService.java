package com.imjjh.Dibs.api.product.service;

import com.imjjh.Dibs.api.product.dto.request.ProductCreateRequestDto;
import com.imjjh.Dibs.api.product.dto.request.ProductSearchRequestDto;
import com.imjjh.Dibs.api.product.dto.request.ProductUpdateRequestDto;
import com.imjjh.Dibs.api.product.dto.response.ProductDetailResponseDto;
import com.imjjh.Dibs.api.product.dto.response.ProductSimpleResponseDto;
import com.imjjh.Dibs.api.product.entity.ProductEntity;
import com.imjjh.Dibs.api.product.exception.ProductErrorCode;
import com.imjjh.Dibs.api.product.mapper.ProductMapper;
import com.imjjh.Dibs.api.product.repository.ProductRepository;
import com.imjjh.Dibs.auth.exception.AuthErrorCode;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.auth.user.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

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

    /**
     * 상품 상세 조회
     * 
     * @param id
     * @return
     */
    @Transactional(readOnly = true)
    public ProductDetailResponseDto getProduct(Long id) {
        ProductEntity productEntity = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ProductErrorCode.PRODUCT_NOT_FOUND));

        return productMapper.toDetailDto(productEntity);
    }

    /**
     * 상품 등록
     * 
     * @param userDetails
     * @param requestDto
     * @return
     */
    @Transactional
    public ProductDetailResponseDto createProduct(CustomUserDetails userDetails,
            ProductCreateRequestDto requestDto) {

        UserEntity userEntity = userRepository.findById(userDetails.getNameLong())
                .orElseThrow(() -> new BusinessException(AuthErrorCode.USER_NOT_FOUND));

        ProductEntity savedEntity = productRepository.save(productMapper.toEntity(requestDto, userEntity));

        return productMapper.toDetailDto(savedEntity);

    }

    /**
     * 상품 수정
     * 
     * @param userDetails
     * @param id
     * @param requestDto
     * @return
     */
    @Transactional
    public ProductDetailResponseDto updateProduct(CustomUserDetails userDetails, Long id,
            ProductUpdateRequestDto requestDto) {

        ProductEntity productEntity = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ProductErrorCode.PRODUCT_NOT_FOUND));

        // TODO 권한 검사

        productMapper.updateFromDto(requestDto, productEntity);
        return productMapper.toDetailDto(productEntity);
    }

    /**
     * soft delete & S3에 저장된 사진을 지우지 않습니다.
     * 
     * @param userDetails
     * @param id
     */
    @Transactional
    public void deleteProduct(CustomUserDetails userDetails, Long id) {
        ProductEntity productEntity = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ProductErrorCode.PRODUCT_NOT_FOUND));

        // TODO: 권한 검사

        productRepository.delete(productEntity);

    }

    public void buyProduct(CustomUserDetails userDetails, Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'buyProduct'");
    }

    public void addToCart(CustomUserDetails userDetails, Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'addToCart'");
    }

}
