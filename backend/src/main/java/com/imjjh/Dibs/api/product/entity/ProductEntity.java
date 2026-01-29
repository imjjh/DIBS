package com.imjjh.Dibs.api.product.entity;

import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.common.BaseEntity;
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
@SQLDelete(sql = "UPDATE product_entity SET deleted_at = now() where id = ?")
@SQLRestriction("deleted_at IS NULL")
public class ProductEntity extends BaseEntity {

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

    @Column(nullable = false)
    @Setter
    private Long price;

    @Column(nullable = false)
    @Setter
    private Integer stockQuantity;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Schema(description = "물건의 현재 상태 (ON_SALE, SOLD_OUT)")
    @Setter
    private StatusType status;

    @Column
    @Setter
    @Schema(description = "S3 또는 외부 이미지 링크")
    private String imageUrl;

    @Column(nullable = false)
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

    @Override
    public void delete() {
        super.delete();
        this.imageUrl = null;
    }
}