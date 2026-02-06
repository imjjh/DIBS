package com.imjjh.Dibs.api.order.repository;

import com.imjjh.Dibs.api.order.entity.OrderEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderEntity, Long>, OrderRepositoryCustom {
    @EntityGraph(attributePaths = { "orderItems", "orderItems.product" })
    Optional<OrderEntity> findById(Long id);
}
