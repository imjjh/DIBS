package com.imjjh.Dibs.order;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import com.imjjh.Dibs.api.order.dto.request.OrderCreateRequestDto;
import com.imjjh.Dibs.api.order.service.OrderService;
import com.imjjh.Dibs.api.product.entity.ProductEntity;
import com.imjjh.Dibs.api.product.entity.StatusType;
import com.imjjh.Dibs.api.product.repository.ProductRepository;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.auth.user.RoleType;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.auth.user.repository.UserRepository;
import com.imjjh.common.annotation.IntegrationTest;

import lombok.extern.slf4j.Slf4j;

import com.imjjh.Dibs.common.service.S3Service;

@Slf4j
@IntegrationTest
public class OrderServiceIntegrationTest {

    @Autowired
    private OrderService orderService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    @MockitoBean
    private S3Service s3Service;

    @Test
    @DisplayName("동시 주문 테스트")
    public void 동시_주문_테스트() throws InterruptedException {
        // given

        // 판매자 & 상품
        UserEntity seller = sellerBuilder();
        ProductEntity productEntity = productBuilder(seller);
        userRepository.save(seller);
        productRepository.save(productEntity);

        // 구매자 100명
        List<UserEntity> buyerList = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            UserEntity buyer = buyerBuilder(String.valueOf(i));
            buyerList.add(buyer);
        }
        List<UserEntity> savedBuyerList = userRepository.saveAll(buyerList);

        // when
        // 쓰레드 생성
        ExecutorService executorService = Executors.newFixedThreadPool(3);

        CountDownLatch latch = new CountDownLatch(savedBuyerList.size());

        for (UserEntity buyer : savedBuyerList) {
            executorService.submit(() -> {
                try {
                    CustomUserDetails userDetails = new CustomUserDetails(buyer);
                    OrderCreateRequestDto requestDto = OrderCreateRequestDto.builder()
                            .deliveryMemo("배송 전에 꼭 연락주세요.")
                            .shippingAddressDetail("000호")
                            .recipientName("홍길동")
                            .recipientPhone("010-1234-5678")
                            .zipCode("12345")
                            .shippingAddress("서울시 00구")
                            .orderItems(List.of(new OrderCreateRequestDto.OrderItemRequest(productEntity.getId(), 1L)))
                            .build();
                    orderService.createOrder(userDetails, requestDto);
                } finally {
                    latch.countDown();
                }
            });
        }

        // 모든 스레드가 끝날 때까지 대기
        latch.await();

        // then
        ProductEntity resultEntity = productRepository.findById(productEntity.getId()).orElseThrow();

        assertThat(resultEntity.getStockQuantity()).isEqualTo(0);
    }

    private ProductEntity productBuilder(UserEntity userEntity) {
        ProductEntity productEntity = ProductEntity.builder()
                .category("의류")
                .description("100개 한정판 예쁜 옷!")
                .price(10000L)
                .seller(userEntity)
                .stockQuantity(100L)
                .build();

        productEntity.setStatus(StatusType.ON_SALE);
        return productEntity;
    }

    private UserEntity sellerBuilder() {
        UserEntity seller = UserEntity.builder()
                .username("seller")
                .password("pw")
                .email("dibs@dibs.com")
                .nickname("옷파는 사람")
                .build();

        seller.addRole(RoleType.SELLER);
        return seller;
    }

    private UserEntity buyerBuilder(String num) {
        UserEntity seller = UserEntity.builder()
                .username("buyer" + num)
                .password("pw" + num)
                .email(String.format("buyer%s@dibs.com", num))
                .nickname("옷사는 사람" + num)
                .build();

        seller.addRole(RoleType.SELLER);
        return seller;
    }
}
