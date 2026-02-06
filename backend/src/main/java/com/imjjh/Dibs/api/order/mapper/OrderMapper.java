package com.imjjh.Dibs.api.order.mapper;

import com.imjjh.Dibs.api.order.dto.request.OrderCreateRequestDto;
import com.imjjh.Dibs.api.order.dto.response.OrderDetailResponseDto;
import com.imjjh.Dibs.api.order.dto.response.OrderSimpleResponseDto;
import com.imjjh.Dibs.api.order.entity.OrderEntity;
import com.imjjh.Dibs.api.order.entity.OrderItemEntity;
import com.imjjh.Dibs.auth.user.UserEntity;

import java.util.List;

import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, // 스프링 빈으로 등록
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, // null 이면 무시
        unmappedTargetPolicy = ReportingPolicy.IGNORE, builder = @Builder(disableBuilder = true))
public interface OrderMapper {

    // 조회
    OrderDetailResponseDto toDetailDto(OrderEntity entity);

    // toDetailDto의 내부 메서드
    @Mapping(target = "productId", source = "entity.product.id")
    @Mapping(target = "productName", source = "entity.product.name")
    @Mapping(target = "price", source = "entity.orderPrice")
    @Mapping(target = "totalPrice", expression = "java(entity.getOrderPrice() * entity.getQuantity())")
    @Mapping(target = "imageUrl", source = "entity.product.imageUrl")
    @Mapping(target = "productStatus", source = "entity.product.status")
    @Mapping(target = "sellerName", source = "entity.product.seller.nickname")
    OrderDetailResponseDto.OrderItemResponseDto toOrderItemDto(OrderItemEntity entity);

    // 생성
    @Mapping(source = "dto.zipCode", target = "zipCode")
    @Mapping(target = "orderItems", ignore = true) // OrderService에서 직접 처리
    OrderEntity toEntity(OrderCreateRequestDto dto, UserEntity user);

    // 목록 조회 (대표 이미지 추출)
    @Mapping(target = "representativeImageUrl", source = "orderItems", qualifiedByName = "extractImageUrl")
    OrderSimpleResponseDto toSimpleDto(OrderEntity entity);

    @Named("extractImageUrl")
    default String extractImageUrl(List<OrderItemEntity> orderItems) {
        if (orderItems == null || orderItems.isEmpty()) {
            return null;
        }
        return orderItems.get(0).getProduct().getImageUrl();
    }
}
