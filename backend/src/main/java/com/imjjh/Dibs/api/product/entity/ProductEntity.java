package com.imjjh.Dibs.api.product.entity;

import com.imjjh.Dibs.api.product.exception.ProductErrorCode;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.common.BaseEntity;
import com.imjjh.Dibs.common.Ownable;
import com.imjjh.Dibs.common.exception.BusinessException;
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
public class ProductEntity extends BaseEntity implements Ownable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "seller_id", referencedColumnName = "id")
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
    private Long stockQuantity;

    @Column(nullable = false, columnDefinition = "VARCHAR(20)")
    @Enumerated(EnumType.STRING)
    @Schema(description = "물건의 현재 상태 (ON_SALE, SOLD_OUT 등)")
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

    @Builder
    public ProductEntity(UserEntity seller, String name, String description,
            Long price, Long stockQuantity,
            String imageUrl, String category) {
        this.seller = seller;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.imageUrl = imageUrl;
        this.category = category;
        this.status = (stockQuantity>0) ? StatusType.ON_SALE: StatusType.SOLD_OUT;
    }

    @Override
    public void delete() {
        super.delete();
        this.imageUrl = null;
    }

    @Override
    public Long getOwnerId() {
        return this.seller.getId();
    }

    /**
     * 주문 생성시 재고 차감
     * 
     * @param quantity
     */
    public void removeStock(Long quantity) {
        if (stockQuantity - quantity < 0) {
            throw new BusinessException(ProductErrorCode.NO_STOCK_QUANTITY);
        }
        this.stockQuantity -= quantity;
        if (stockQuantity == 0) {
            this.status=StatusType.SOLD_OUT;
        }
    }

    /**
     * 주문 취소시 재고 복구
     * 
     * @param quantity
     */
    public void addStock(Long quantity) {
        this.stockQuantity += quantity;
        if (this.status == StatusType.SOLD_OUT && this.stockQuantity > 0) {
            this.status = StatusType.ON_SALE;
        }
    }
}