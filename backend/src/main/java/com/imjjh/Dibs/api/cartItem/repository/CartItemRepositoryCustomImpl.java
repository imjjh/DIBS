package com.imjjh.Dibs.api.cartItem.repository;

import com.imjjh.Dibs.api.cartItem.dto.response.CartItemResponseDto;
import com.imjjh.Dibs.auth.user.QUserEntity;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.imjjh.Dibs.api.cartItem.entity.QCartItemEntity.cartItemEntity;
import static com.imjjh.Dibs.api.product.entity.QProductEntity.productEntity;

@Repository
@RequiredArgsConstructor
public class CartItemRepositoryCustomImpl implements CartItemRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<CartItemResponseDto> searchCartItems(UserEntity user, Pageable pageable) {
        // 명시적 조인을 위한 별칭 생성 (판매자)
        QUserEntity seller = new QUserEntity("seller");

        List<CartItemResponseDto> content = queryFactory
                .select(Projections.constructor(CartItemResponseDto.class,
                        productEntity.id,
                        productEntity.name,
                        productEntity.imageUrl,
                        productEntity.price,
                        cartItemEntity.quantity,
                        seller.nickname
                ))
                .from(cartItemEntity)
                .join(cartItemEntity.product, productEntity) // 장바구니-상품 조인
                .join(productEntity.seller, seller) // 상품-판매자 조인
                .where(cartItemEntity.user.eq(user))
                .orderBy(cartItemEntity.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(cartItemEntity.count())
                .from(cartItemEntity)
                .where(cartItemEntity.user.eq(user))
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }
}
