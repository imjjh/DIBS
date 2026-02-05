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
import com.imjjh.Dibs.common.service.S3Service;

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
    private final S3Service s3Service;

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
     * S3에 이미지 업로드 후 호출, DTO안의 url을 DB 받아 저장
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
     * 상품 수정 & s3 이미지 url 제거
     * TODO: 상품 이미지를 여러개 업로드 가능하게
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

        // 권한 검사
        productEntity.validateOwner(userDetails);

        // 상품 업데이트
        String oldUrl = productEntity.getImageUrl();
        productMapper.updateFromDto(requestDto, productEntity);

        // S3에서 예전 이미지 제거
        if (requestDto.imageUrl() != null && !requestDto.imageUrl().equals(oldUrl)) {
            s3Service.deleteImageFile(oldUrl);
        }

        return productMapper.toDetailDto(productEntity);
    }

    /**
     * soft delete & S3에서 이미지 제거
     * 
     * @param userDetails
     * @param id
     */
    @Transactional
    public void deleteProduct(CustomUserDetails userDetails, Long id) {
        ProductEntity productEntity = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ProductErrorCode.PRODUCT_NOT_FOUND));

        // 권한 검사
        productEntity.validateOwner(userDetails);

        // S3 삭제를 위한 URL
        String urlToDelete = productEntity.getImageUrl();

        // 엔티티 삭제
        productEntity.delete();

        // S3에서 이미지 삭제
        s3Service.deleteImageFile(productEntity.getImageUrl());

    }
}
