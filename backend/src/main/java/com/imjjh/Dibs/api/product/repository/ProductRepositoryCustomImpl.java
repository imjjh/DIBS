package com.imjjh.Dibs.api.product.repository;

import com.imjjh.Dibs.api.product.dto.request.ProductSearchRequestDto;
import com.imjjh.Dibs.api.product.dto.response.ProductSimpleResponseDto;
import com.querydsl.core.types.Projections;
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

    @Override
    public Page<ProductSimpleResponseDto> search(ProductSearchRequestDto requestDto, Pageable pageable) {
        List<ProductSimpleResponseDto> content = queryFactory
                .select(
                        Projections.constructor(ProductSimpleResponseDto.class,
                                productEntity.id,
                                productEntity.name,
                                productEntity.price,
                                productEntity.status,
                                productEntity.imageUrl,
                                productEntity.category,
                                productEntity.discountRate
                        ))
                .from(productEntity)
                .where()
                .orderBy(productEntity.id.desc())
                .offset(pageable.getOffset()) // TODO: 커서 기반으로 수정 필요
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .select(productEntity.count())
                .from(productEntity)
                .where()
                .fetchOne();

        Page<ProductSimpleResponseDto> result = new PageImpl<>(content, pageable, total);

        return result;
    }
}
