package com.imjjh.Dibs.api.product.repository;

import com.imjjh.Dibs.api.product.dto.request.ProductSearchRequestDto;
import com.imjjh.Dibs.api.product.dto.response.ProductSimpleResponseDto;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;

import static com.imjjh.Dibs.api.product.entity.QProductEntity.productEntity;

@RequiredArgsConstructor
@Repository
public class ProductRepositoryCustomImpl implements ProductRepositoryCustom {

        private final JPAQueryFactory queryFactory;

        /**
         * 일반 검색
         * 
         * @param requestDto
         * @param pageable
         * @return
         */
        @Override
        public Page<ProductSimpleResponseDto> search(ProductSearchRequestDto requestDto, Pageable pageable) {
                return search(requestDto, null, pageable);
        }

        /**
         * 판매자의 자신의 물품만 검색
         * 
         * @param requestDto
         * @param sellerId
         * @param pageable
         * @return
         */
        @Override
        public Page<ProductSimpleResponseDto> search(ProductSearchRequestDto requestDto, Long sellerId,
                        Pageable pageable) {

                List<ProductSimpleResponseDto> content = queryFactory
                                .select(
                                                Projections.constructor(ProductSimpleResponseDto.class,
                                                                productEntity.id,
                                                                productEntity.name,
                                                                productEntity.price,
                                                                productEntity.stockQuantity,
                                                                productEntity.status,
                                                                productEntity.imageUrl,
                                                                productEntity.category))
                                .from(productEntity)
                                .where(
                                                categoryEq(requestDto.category()),
                                                keywordLike(requestDto.keyword()),
                                                sellerIdEq(sellerId))
                                .orderBy(productEntity.id.desc())
                                .offset(pageable.getOffset()) // TODO: 커서 기반으로 수정 필요
                                .limit(pageable.getPageSize())
                                .fetch();

                Long total = queryFactory
                                .select(productEntity.count())
                                .from(productEntity)
                                .where(
                                                categoryEq(requestDto.category()),
                                                keywordLike(requestDto.keyword()),
                                                sellerIdEq(sellerId))
                                .fetchOne();

                return new PageImpl<>(content, pageable, total != null ? total : 0L);
        }

        private BooleanExpression categoryEq(String category) {
                return (category == null || category.isBlank()) ? null : productEntity.category.eq(category);
        }

        private BooleanExpression keywordLike(String keyword) {
                return (keyword == null || keyword.isBlank()) ? null
                                : productEntity.name.containsIgnoreCase(keyword)
                                                .or(productEntity.description.containsIgnoreCase(keyword));
        }

        private BooleanExpression sellerIdEq(Long sellerId) {
                return (sellerId == null) ? null : productEntity.seller.id.eq(sellerId);

        }

}
