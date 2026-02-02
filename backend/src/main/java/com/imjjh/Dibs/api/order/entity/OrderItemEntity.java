package com.imjjh.Dibs.api.order.entity;

import com.imjjh.Dibs.api.product.entity.ProductEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "order_item_entity")
public class OrderItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @Setter
    private OrderEntity order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private ProductEntity product;

    @Column(nullable = false)
    private Long orderPrice; // 주문 당시 가격

    @Column(nullable = false)
    private Long quantity; // 주문 수량

    @Builder
    public OrderItemEntity(ProductEntity product, Long orderPrice, Long quantity) {
        this.product = product;
        this.orderPrice = orderPrice;
        this.quantity = quantity;
    }

    public static OrderItemEntity create(ProductEntity productEntity, Long quantity) {
        return OrderItemEntity.builder()
                .product(productEntity)
                .quantity(quantity)
                .orderPrice(productEntity.getPrice()) // 가격 스냅샷
                .build();
    }



}
