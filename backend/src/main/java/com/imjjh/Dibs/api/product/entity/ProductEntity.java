package com.imjjh.Dibs.api.product.entity;

import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.common.BaseTimeEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@NoArgsConstructor
@Getter
@SQLDelete(sql = "UPDATE product_entity SET is_deleted = true where id = ?")
@SQLRestriction("is_deleted = false")
public class ProductEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "seller_id") // referencedColumnName의 기본값이 상대방의 PK라서 굳이 적지 않아도 됨
    private UserEntity seller;

    @Column
    @Setter
    private String name;

    @Column
    @Setter
    private String description;

    @Column
    @Setter
    private Long price;

    @Column
    @Setter
    private Integer stockQuantity;

    @Column
    @Enumerated(EnumType.STRING)
    @Schema(description = "물건의 현재 상태 (ON_SALE, SOLD_OUT)")
    @Setter
    private StatusType status;

    @Column
    @Setter
    @Schema(description = "S3 또는 외부 이미지 링크")
    private String imageUrl;

    @Column
    @Setter
    @Schema(description = "신발, 의류 등")
    private String category;

    @Column
    @Setter
    @Schema(description = "타임딜 가격 저장용")
    private Long specialPrice;

    @Column
    @Setter
    @Schema(description = "화면에 표시될 할인률")
    private Integer discountRate;

    @Builder
    public ProductEntity(UserEntity seller, String name, String description,
            Long price, Integer stockQuantity,
            String imageUrl, String category) {
        this.seller = seller;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.imageUrl = imageUrl;
        this.category = category;

        this.specialPrice = 0L;
        this.discountRate = 0;
        this.status = StatusType.PREPARING;
    }
}