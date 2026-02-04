package com.imjjh.Dibs.api.order.entity;

import com.imjjh.Dibs.api.product.exception.ProductErrorCode;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.common.exception.BusinessException;

import jakarta.persistence.*;
import lombok.AccessLevel;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "order_entity")
@EntityListeners(AuditingEntityListener.class)
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime orderedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemEntity> orderItems = new ArrayList<>();

    private String orderName; // 주문명 (예: 나이키 신발 외 2건)

    private String paymentUid; // 결제사(PG) 결제 고유 번호

    @Column(nullable = false)
    private Long totalPrice; // 총 주문 금액

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    // 배송 정보
    private String recipientName;
    private String recipientPhone;
    private String shippingAddress;
    private String shippingAddressDetail;
    private String zipCode;
    private String deliveryMemo;

    @Builder
    public OrderEntity(UserEntity user, String orderName, Long totalPrice,
            String recipientName, String recipientPhone,
            String shippingAddress, String shippingAddressDetail, String zipCode, String deliveryMemo) {
        this.user = user;
        this.orderName = orderName;
        this.totalPrice = totalPrice;
        this.status = OrderStatus.PENDING; // 초기 상태
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.shippingAddress = shippingAddress;
        this.shippingAddressDetail = shippingAddressDetail;
        this.zipCode = zipCode;
        this.deliveryMemo = deliveryMemo;
    }

    public void addOrderItem(OrderItemEntity orderItem) {
        orderItems.add(orderItem);
        orderItem.setOrder(this);
    }

    // 상태 변경 메서드
    public void paymentComplete(String paymentUid) {
        this.paymentUid = paymentUid;
        this.status = OrderStatus.PAID;
    }

    public void cancel() {
        this.status = OrderStatus.CANCELLED;
    }

    public void calculateTotalPrice() {
        this.totalPrice = this.orderItems.stream()
                .mapToLong(item -> {
                    Long price = item.getOrderPrice();

                    if (price == null) {
                        throw new BusinessException(ProductErrorCode.NO_ORDER_PRICE);
                    }

                    return price * item.getQuantity();
                })
                .sum();
    }
}
