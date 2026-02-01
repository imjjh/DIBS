package com.imjjh.Dibs.api.cartItem.repository;

import com.imjjh.Dibs.api.cartItem.dto.response.CartItemResponseDto;
import com.imjjh.Dibs.auth.user.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CartItemRepositoryCustom {
    Page<CartItemResponseDto> searchCartItems(UserEntity user, Pageable pageable);
}
