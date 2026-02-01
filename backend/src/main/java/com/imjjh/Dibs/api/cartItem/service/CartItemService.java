package com.imjjh.Dibs.api.cartItem.service;

import com.imjjh.Dibs.api.cartItem.dto.request.CartItemCreateRequestDto;
import com.imjjh.Dibs.api.cartItem.entity.CartItemEntity;
import com.imjjh.Dibs.api.cartItem.repository.CartItemRepository;
import com.imjjh.Dibs.api.product.entity.ProductEntity;
import com.imjjh.Dibs.api.product.exception.ProductErrorCode;
import com.imjjh.Dibs.api.product.repository.ProductRepository;
import com.imjjh.Dibs.auth.exception.AuthErrorCode;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.auth.user.repository.UserRepository;
import com.imjjh.Dibs.common.exception.BusinessException;
import com.imjjh.Dibs.common.exception.CommonErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import com.imjjh.Dibs.api.cartItem.dto.response.CartItemResponseDto;

import com.imjjh.Dibs.common.dto.PagedResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class CartItemService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public PagedResponse<CartItemResponseDto> getCartItems(CustomUserDetails userDetails, Pageable pageable) {
        UserEntity userEntity = userRepository.findById(userDetails.getNameLong())
                .orElseThrow(() -> new BusinessException(AuthErrorCode.USER_NOT_FOUND));

        Page<CartItemResponseDto> pageResult = cartItemRepository.searchCartItems(userEntity, pageable);

        return PagedResponse.of(pageResult);
    }

    @Transactional
    public void createCartItem(CustomUserDetails userDetails, CartItemCreateRequestDto requestDto) {

        UserEntity userEntity = userRepository.findById(userDetails.getNameLong())
                .orElseThrow(() -> new BusinessException(AuthErrorCode.USER_NOT_FOUND));
        ProductEntity productEntity = productRepository.findById(requestDto.productId())
                .orElseThrow(() -> new BusinessException(ProductErrorCode.PRODUCT_NOT_FOUND));

        Optional<CartItemEntity> optionalCartItem = cartItemRepository.findByUserAndProduct(userEntity, productEntity);

        if (optionalCartItem.isPresent()) {
            // 이미 있으면 수량 추가
            optionalCartItem.get().addQuantity(requestDto.quantity());
        } else {
            // 없으면 새로 생성 후 저장
            CartItemEntity cartItemEntity = CartItemEntity.builder()
                    .user(userEntity)
                    .product(productEntity)
                    .quantity(requestDto.quantity())
                    .build();

            cartItemRepository.save(cartItemEntity);
        }
    }

    @Transactional
    public void deleteCartItem(CustomUserDetails userDetails, Long productId) {
        UserEntity userEntity = userRepository.findById(userDetails.getNameLong())
                .orElseThrow(() -> new BusinessException(AuthErrorCode.USER_NOT_FOUND));
        ProductEntity productEntity = productRepository.findById(productId)
                .orElseThrow(() -> new BusinessException(ProductErrorCode.PRODUCT_NOT_FOUND));

        CartItemEntity cartItemEntity = cartItemRepository.findByUserAndProduct(userEntity, productEntity)
                .orElseThrow(() -> new BusinessException(CommonErrorCode.BAD_REQUEST));

        cartItemRepository.delete(cartItemEntity);
    }

    @Transactional
    public void updateCartItem(CustomUserDetails userDetails, Long productId, Long quantity) {
        UserEntity userEntity = userRepository.findById(userDetails.getNameLong())
                .orElseThrow(() -> new BusinessException(AuthErrorCode.USER_NOT_FOUND));
        ProductEntity productEntity = productRepository.findById(productId)
                .orElseThrow(() -> new BusinessException(ProductErrorCode.PRODUCT_NOT_FOUND));

        CartItemEntity cartItemEntity = cartItemRepository.findByUserAndProduct(userEntity, productEntity)
                .orElseThrow(() -> new BusinessException(CommonErrorCode.BAD_REQUEST));

        cartItemEntity.changeQuantity(quantity);
    }
}
