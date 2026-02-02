package com.imjjh.Dibs.api.order.repository;

import com.imjjh.Dibs.api.order.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Long> {
}
