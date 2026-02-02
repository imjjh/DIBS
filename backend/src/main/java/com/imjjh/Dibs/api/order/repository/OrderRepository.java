package com.imjjh.Dibs.api.order.repository;

import com.imjjh.Dibs.api.order.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
}
