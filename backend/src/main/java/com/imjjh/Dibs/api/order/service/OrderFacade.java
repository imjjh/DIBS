package com.imjjh.Dibs.api.order.service;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import com.imjjh.Dibs.api.order.dto.request.OrderCreateRequestDto;
import com.imjjh.Dibs.auth.user.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrderFacade {

    private final OrderService orderService;

    // 상품별 락 객체 (같은 상품만 대기를 위해 사용)
    // 메모리 누수 발생 가능 상품이 많아지면 키가 무수히 많아질 수 있음 -> (redis ttl)으로 해결
    private final ConcurrentHashMap<Long, Object> productLocks = new ConcurrentHashMap<>();

    public void createOrderWithLock(CustomUserDetails userDetails, OrderCreateRequestDto requestDto) {
        List<Long> sortedProductIds = requestDto.orderItems().stream()
                .map(item -> item.productId())
                .distinct()
                .sorted()
                .toList();

        // 해당 상품에 대한 락 획득

        executeWithRecursiveLock(0, sortedProductIds, userDetails, requestDto);

    }

    private void executeWithRecursiveLock(int index, List<Long> sortedProductIds, CustomUserDetails userDetails,
            OrderCreateRequestDto requestDto) {
        if (index == sortedProductIds.size()) {
            orderService.createOrder(userDetails, requestDto);
            return;
        }

        Long productId = sortedProductIds.get(index);
        Object lock = productLocks.computeIfAbsent(productId, k -> new Object());

        synchronized (lock) {
            executeWithRecursiveLock(index + 1, sortedProductIds, userDetails, requestDto);
        }
    }
}
