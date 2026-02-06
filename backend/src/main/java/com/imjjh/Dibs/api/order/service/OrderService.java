package com.imjjh.Dibs.api.order.service;

import com.imjjh.Dibs.api.cartItem.entity.CartItemEntity;
import com.imjjh.Dibs.api.cartItem.repository.CartItemRepository;
import com.imjjh.Dibs.api.order.dto.request.OrderCreateRequestDto;
import com.imjjh.Dibs.api.order.dto.request.OrderSearchRequestDto;
import com.imjjh.Dibs.api.order.dto.response.OrderDetailResponseDto;
import com.imjjh.Dibs.api.order.dto.response.OrderSimpleResponseDto;
import com.imjjh.Dibs.api.order.entity.OrderEntity;
import com.imjjh.Dibs.api.order.entity.OrderItemEntity;
import com.imjjh.Dibs.api.order.exception.OrderErrorCode;
import com.imjjh.Dibs.api.order.mapper.OrderMapper;
import com.imjjh.Dibs.api.order.repository.OrderRepository;
import com.imjjh.Dibs.api.product.entity.ProductEntity;
import com.imjjh.Dibs.api.product.exception.ProductErrorCode;
import com.imjjh.Dibs.api.product.repository.ProductRepository;
import com.imjjh.Dibs.auth.exception.AuthErrorCode;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.auth.user.repository.UserRepository;
import com.imjjh.Dibs.common.dto.PagedResponse;
import com.imjjh.Dibs.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

        private final OrderRepository orderRepository;
        private final UserRepository userRepository;
        private final OrderMapper orderMapper;
        private final ProductRepository productRepository;
        private final CartItemRepository cartItemRepository;

        /**
         * 주문 목록 조회
         * 
         * @param userDetails
         * @return
         */
        @Transactional(readOnly = true)
        public PagedResponse<OrderSimpleResponseDto> searchOrder(CustomUserDetails userDetails,
                        OrderSearchRequestDto requestDto) {
                UserEntity userEntity = userRepository.findById(userDetails.getNameLong())
                                .orElseThrow(() -> new BusinessException(AuthErrorCode.USER_NOT_FOUND));

                return PagedResponse.of(
                                orderRepository.findAllByUserIdOrderByIdDescent(userDetails.getNameLong(),
                                                requestDto.toPageable()));

        }

        /**
         * 주문 상세 조회
         * 
         * @param userDetails
         * @param id
         * @return
         */
        @Transactional(readOnly = true)
        public OrderDetailResponseDto getOrder(CustomUserDetails userDetails, Long id) {

                UserEntity userEntity = userRepository.findById(userDetails.getNameLong())
                                .orElseThrow(() -> new BusinessException(AuthErrorCode.USER_NOT_FOUND));
                OrderEntity orderEntity = orderRepository.findById(id)
                                .orElseThrow(() -> new BusinessException(OrderErrorCode.ORDER_NOT_FOUND));
                // 본인 주문이 맞는지 검증
                orderEntity.validateOwner(userDetails);

                return orderMapper.toDetailDto(orderEntity);
        }

        @Transactional
        public void createOrder(CustomUserDetails userDetails, OrderCreateRequestDto requestDto) {
                // 유저 조회
                UserEntity userEntity = userRepository.findById(userDetails.getNameLong())
                                .orElseThrow(() -> new BusinessException(AuthErrorCode.USER_NOT_FOUND));

                // 주문 생성
                OrderEntity orderEntity = orderMapper.toEntity(requestDto, userEntity);

                // 상품 ID 추출
                List<Long> productIds = requestDto.orderItems()
                                .stream()
                                .map(OrderCreateRequestDto.OrderItemRequest::productId)
                                .toList();

                // 상품 조회
                List<ProductEntity> products = productRepository.findAllById(productIds);

                // 상품 매핑
                Map<Long, ProductEntity> productEntityMap = products.stream()
                                .collect(Collectors.toMap(ProductEntity::getId, p -> p));

                // orderItems 생성
                for (OrderCreateRequestDto.OrderItemRequest item : requestDto.orderItems()) {

                        ProductEntity productEntity = productEntityMap.get(item.productId());

                        // 상품이 없는 경우
                        if (productEntity == null) {
                                throw new BusinessException(ProductErrorCode.PRODUCT_NOT_FOUND);
                        }

                        productEntity.removeStock(item.quantity());

                        OrderItemEntity orderItemEntity = OrderItemEntity.create(productEntity, item.quantity());

                        // 주문목록에 상품을 추가
                        orderEntity.addOrderItem(orderItemEntity);
                }

                // 최종 가격 계산
                orderEntity.calculateTotalPrice();

                // 주문명 업데이트
                orderEntity.updateOrderName();

                // 주문 등록
                orderRepository.save(orderEntity);

                // 장바구니에서 구입 목록 비우기
                cartItemRepository.deleteByUserAndProductIdIn(userEntity, productIds);

        }

        @Transactional
        public void cancelOrder(CustomUserDetails userDetails, Long orderId, Boolean addToCart) {

                UserEntity userEntity = userRepository.findById(userDetails.getNameLong())
                                .orElseThrow(() -> new BusinessException(AuthErrorCode.USER_NOT_FOUND));
                OrderEntity orderEntity = orderRepository.findById(orderId)
                                .orElseThrow(() -> new BusinessException(OrderErrorCode.ORDER_NOT_FOUND));

                orderEntity.cancel();

                // 재고 복구
                for (OrderItemEntity item : orderEntity.getOrderItems()) {
                        // 삭제되지 않은 상품에 대해서만 재고를 복구
                        if (item.getProduct() != null) {
                                item.getProduct().addStock(item.getQuantity());
                        }
                }

                // 장바구니에 다시 추가
                if (Boolean.TRUE.equals(addToCart)) {
                        List<CartItemEntity> cartItems = orderEntity.getOrderItems().stream()
                                        .filter(item -> item.getProduct() != null) // 삭제된 상품 필터링
                                        .map(item -> CartItemEntity.builder()
                                                        .user(userEntity)
                                                        .product(item.getProduct())
                                                        .quantity(item.getQuantity())
                                                        .build())
                                        .toList();

                        cartItemRepository.saveAll(cartItems);
                }

        }

}
