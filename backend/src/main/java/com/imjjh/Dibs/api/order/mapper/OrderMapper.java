package com.imjjh.Dibs.api.order.mapper;

import com.imjjh.Dibs.api.order.dto.request.OrderCreateRequestDto;
import com.imjjh.Dibs.api.order.dto.response.OrderDetailResponseDto;
import com.imjjh.Dibs.api.order.entity.OrderEntity;
import com.imjjh.Dibs.auth.user.UserEntity;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, // 스프링 빈으로 등록
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, // null 이면 무시
        unmappedTargetPolicy = ReportingPolicy.IGNORE, builder = @Builder(disableBuilder = true))
public interface OrderMapper {

    // 조회
    OrderDetailResponseDto toDetailDto(OrderEntity entity);

    // 생성
    @Mapping(source = "dto.zipCode", target = "zipCode")
    @Mapping(target = "orderItems", ignore = true) // OrderService에서 직접 처리
    OrderEntity toEntity(OrderCreateRequestDto dto, UserEntity user);

}
