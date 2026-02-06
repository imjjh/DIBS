package com.imjjh.Dibs.api.order.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.imjjh.Dibs.api.order.dto.response.OrderSimpleResponseDto;
import com.imjjh.Dibs.api.order.entity.OrderEntity;
import com.imjjh.Dibs.api.order.mapper.OrderMapper;
import com.querydsl.jpa.impl.JPAQueryFactory;
import static com.imjjh.Dibs.api.order.entity.QOrderEntity.orderEntity;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class OrderRepositoryCustomImpl implements OrderRepositoryCustom {

        private final JPAQueryFactory queryFactory;
        private final OrderMapper orderMapper;

        @Override
        public Page<OrderSimpleResponseDto> findAllByUserIdOrderByIdDescent(Long userId, Pageable pageable) {

                List<OrderEntity> orders = queryFactory
                                .selectFrom(orderEntity)
                                .where(orderEntity.user.id.eq(userId))
                                .orderBy(orderEntity.id.desc())
                                .offset(pageable.getOffset())
                                .limit(pageable.getPageSize())
                                .fetch();

                Long total = queryFactory
                                .select(orderEntity.count())
                                .from(orderEntity)
                                .where(orderEntity.user.id.eq(userId))
                                .fetchOne();

                List<OrderSimpleResponseDto> content = orders.stream()
                                .map(order -> orderMapper.toSimpleDto(order))
                                .toList();

                return new PageImpl<>(content, pageable, total != null ? total : 0L);
        }

}
