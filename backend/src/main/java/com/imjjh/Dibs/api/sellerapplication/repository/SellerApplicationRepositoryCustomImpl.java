package com.imjjh.Dibs.api.sellerapplication.repository;

import com.imjjh.Dibs.api.sellerapplication.dto.SellerApplicationResponseDto;
import com.imjjh.Dibs.api.sellerapplication.dto.SellerApplicationSearchRequestDto;
import com.imjjh.Dibs.api.sellerapplication.entity.ApplicationStatus;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import static com.imjjh.Dibs.api.sellerapplication.entity.QSellerApplicationEntity.sellerApplicationEntity;


@Repository
@RequiredArgsConstructor
public class SellerApplicationRepositoryCustomImpl implements SellerApplicationRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<SellerApplicationResponseDto> search(SellerApplicationSearchRequestDto requestDto, Pageable pageable) {
        List<SellerApplicationResponseDto> content = queryFactory
                .select(
                        Projections.constructor(SellerApplicationResponseDto.class,
                                sellerApplicationEntity.id,
                                sellerApplicationEntity.user.id,
                                sellerApplicationEntity.businessName,
                                sellerApplicationEntity.businessNumber,
                                // 쿼리 수준에서 Enum -> String 변환
                                new CaseBuilder()
                                        .when(sellerApplicationEntity.applicationStatus.eq(ApplicationStatus.PENDING)).then("대기 중")
                                        .when(sellerApplicationEntity.applicationStatus.eq(ApplicationStatus.APPROVED)).then("승인")
                                        .otherwise("거절"),
                                sellerApplicationEntity.rejectReason
                        ))
                .from(sellerApplicationEntity)
                .where()
                .orderBy(sellerApplicationEntity.id.desc())
                .offset(pageable.getOffset()) // TODO: 커서 기반으로 수정 필요
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .select(sellerApplicationEntity.count())
                .from(sellerApplicationEntity)
                .where()
                .fetchOne();

        Page<SellerApplicationResponseDto> result = new PageImpl<>(content, pageable, total);

        return result;
    }
}
