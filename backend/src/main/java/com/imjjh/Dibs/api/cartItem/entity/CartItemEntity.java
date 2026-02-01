package com.imjjh.Dibs.api.cartItem.entity;

import com.imjjh.Dibs.api.product.entity.ProductEntity;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.common.BaseEntity;

import com.imjjh.Dibs.common.Ownable;
import jakarta.persistence.*;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
public class CartItemEntity extends BaseEntity implements Ownable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private ProductEntity product;

    @Column(nullable = false)
    private Long quantity;

    @Builder
    public CartItemEntity(UserEntity user, ProductEntity product, Long quantity) {
        changeQuantity(quantity);
        this.user = user;
        this.product = product;
    }

    @Override
    public Long getOwnerId() {
        return this.user.getId();
    }

    public void changeQuantity(Long quantity) {
        if (quantity == null || quantity < 1) {
            quantity = 1L;
        }
        this.quantity = quantity;
    }

    public void addQuantity(Long quantity) {
        if (quantity == null || quantity < 1) {
            return;
        }
        this.quantity += quantity;
    }
}
