package com.imjjh.Dibs.api.product.entity;

import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.common.BaseTimeEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Getter
public class ProductEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "seller_id") // referencedColumnName의 기본값이 상대방의 PK라서 굳이 적지 않아도 됨
    private UserEntity seller;

    @Column
    private String name;

    @Column
    private String description;

    @Column
    private Long price;

    @Column
    private Integer stockQuantity;

    @Column
    @Enumerated(EnumType.STRING)
    @Schema(description = "물건의 현재 상태 (품절, 판매 중, 예약 중)")
    private StatusType status;

    @Column
    @Schema(description = "S3 또는 외부 이미지 링크")
    private String imageUrl;

    @Column
    @Schema(description = "신발, 의류 등")
    private String category;

    @Column
    @Schema(description = "타임딜 가격 저장용")
    private Long specialPrice;

    @Column
    @Schema(description = "화면에 표시될 할인률")
    private Integer discountRate;
}