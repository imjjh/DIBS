package com.imjjh.Dibs.api.order.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

import com.imjjh.Dibs.api.order.dto.request.OrderCreateRequestDto;
import com.imjjh.Dibs.api.order.dto.response.OrderDetailResponseDto;
import com.imjjh.Dibs.api.order.exception.OrderErrorCode;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.common.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrderFacade {

    private final OrderService orderService;
    private final RedissonClient redissonClient;

    // 주문 생성
    public void createOrderWithLock(CustomUserDetails userDetails, OrderCreateRequestDto requestDto) {
        List<Long> productIds = requestDto.orderItems().stream()
                .map(item -> item.productId())
                .toList();

        executeWithLock(productIds, () -> orderService.createOrder(userDetails, requestDto));
    }

    // 주문 취소
    public void cancelOrderWithLock(CustomUserDetails userDetails, Long orderId, Boolean addToCart) {
        OrderDetailResponseDto order = orderService.getOrder(userDetails, orderId);

        List<Long> productIds = order.orderItems().stream()
                .map(item -> item.productId())
                .filter(id-> id!=null) // 주문 상품(orderItemEntity)은 삭제되지 않았지만 상품(productEntity)는 삭제되어 productId가 null일 수 있음
                .toList();

        executeWithLock(productIds, () -> orderService.cancelOrder(userDetails, orderId, addToCart));
    }

    // 락을 걸고 실행
    private void executeWithLock(List<Long> productIds, Runnable action) {
        List<Long> sortedProductIds = productIds.stream()
                .sorted() // 데드락 방지
                .distinct()
                .toList();

        List<RLock> locks = new ArrayList<>();
        for (Long productId : sortedProductIds) {
            locks.add(redissonClient.getLock("lock:product:" + productId));
        }

        RLock multiLock = redissonClient.getMultiLock(locks.toArray(new RLock[0]));

        try {
            // 동작 방식 All or nothing
            boolean available = multiLock.tryLock(10, 3, TimeUnit.SECONDS);

            if (!available) {
                throw new BusinessException(OrderErrorCode.ORDER_TRAFFIC_EXCEEDED);
            }

            action.run();
        } catch (InterruptedException e) {
            throw new BusinessException(OrderErrorCode.SERVER_ERROR);
        } finally {
            if (multiLock.isHeldByCurrentThread()) {
                multiLock.unlock();
            }
        }
    }
}
