package com.imjjh.Dibs.api.cartItem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.imjjh.Dibs.api.cartItem.entity.CartItemEntity;

public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {

}
