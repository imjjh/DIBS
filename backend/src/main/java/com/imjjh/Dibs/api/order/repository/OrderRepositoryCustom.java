package com.imjjh.Dibs.api.order.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.imjjh.Dibs.api.order.dto.response.OrderSimpleResponseDto;

public interface OrderRepositoryCustom {
    Page<OrderSimpleResponseDto> findAllByUserIdOrderByIdDescent(Long nameLong, Pageable pageable);

}
