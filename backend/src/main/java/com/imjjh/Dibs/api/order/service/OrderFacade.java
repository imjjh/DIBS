package com.imjjh.Dibs.api.order.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

import com.imjjh.Dibs.api.order.dto.request.OrderCreateRequestDto;
import com.imjjh.Dibs.api.order.exception.OrderErrorCode;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.common.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrderFacade {

    private final OrderService orderService;
    private final RedissonClient redissonClient;

    public void createOrderWithLock(CustomUserDetails userDetails, OrderCreateRequestDto requestDto) {

        // 중복 id 제거
        List<Long> sortedProductIds = requestDto.orderItems().stream()
                .map(item -> item.productId())
                .sorted()
                .distinct()
                .toList();

        // redisson 락 객체 리스트 생성
        List<RLock> locks = new ArrayList<>();
        for (Long productId : sortedProductIds) {
            locks.add(redissonClient.getLock("lock:product:" + productId));
        }

        RLock multiLock = redissonClient.getMultiLock(locks.toArray(new RLock[0]));

        try {
            // waitTime만큼 대기(재시도), leaseTime 후에 무조건 락 해제 (안전장치)
            boolean available = multiLock.tryLock(10, 3, TimeUnit.SECONDS);

            if (!available) {
                throw new BusinessException(OrderErrorCode.ORDER_TRAFFIC_EXCEEDED);
            }

            orderService.createOrder(userDetails, requestDto);
        } catch (InterruptedException e) {
            throw new BusinessException(OrderErrorCode.SERVER_ERROR);
        } finally {
            if (multiLock.isHeldByCurrentThread()) {
                multiLock.unlock();
            }
        }
    }

}
