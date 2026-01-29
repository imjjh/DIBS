package com.imjjh.Dibs.auth;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import com.imjjh.Dibs.auth.dto.RegisterRequestDto;
import com.imjjh.Dibs.auth.service.AuthService;
import com.imjjh.Dibs.auth.user.repository.UserRepository;
import com.imjjh.Dibs.common.service.S3Service;
import com.imjjh.common.annotation.IntegrationTest;

@IntegrationTest
public class AuthIntegrationTest {

    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;

    @MockitoBean
    private S3Service s3Service;

    @Test
    @DisplayName("회원가입 통합 테스트")
    void 회원가입_통합_테스트() {
        // given
        RegisterRequestDto dto = RegisterRequestDto.builder()
                .username("admin")
                .password("Password123!@")
                .nickname("imadmin")
                .email("admin123@dibs.com")
                .build();

        // when
        authService.register(dto);

        // then
        assertThat(userRepository.findByUsername("admin")).isPresent();
    }

}
