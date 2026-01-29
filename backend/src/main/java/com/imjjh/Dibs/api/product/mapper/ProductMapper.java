package com.imjjh.Dibs.api.product.mapper;

import org.mapstruct.*;

import com.imjjh.Dibs.api.product.dto.response.ProductDetailResponseDto;
import com.imjjh.Dibs.api.product.dto.request.ProductCreateRequestDto;
import com.imjjh.Dibs.api.product.dto.request.ProductUpdateRequestDto;
import com.imjjh.Dibs.api.product.entity.ProductEntity;
import com.imjjh.Dibs.auth.user.UserEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, // 스프링 빈으로 등록
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, // null 이면 무시
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {
    // 조회
    @Mapping(source = "entity.seller.nickname", target = "sellerName")
    ProductDetailResponseDto toDetailDto(ProductEntity entity);

    // 생성
    ProductEntity toEntity(ProductCreateRequestDto dto, UserEntity seller);

    // 수정
    void updateFromDto(ProductUpdateRequestDto dto, @MappingTarget ProductEntity productEntity);

}
