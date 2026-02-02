package com.imjjh.Dibs.api.cartItem.repository;

import com.imjjh.Dibs.api.product.entity.ProductEntity;
import com.imjjh.Dibs.auth.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import com.imjjh.Dibs.api.cartItem.entity.CartItemEntity;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItemEntity, Long>, CartItemRepositoryCustom {

    Optional<CartItemEntity> findByUserAndProduct(UserEntity userEntity, ProductEntity productEntity);

    void deleteByUserAndProductIdIn(UserEntity userEntity, List<Long> productIds);
}
