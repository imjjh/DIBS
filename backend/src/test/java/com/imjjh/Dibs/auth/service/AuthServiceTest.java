package com.imjjh.Dibs.auth.service;

import com.imjjh.Dibs.auth.dto.RegisterRequestDto;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.auth.user.repository.UserRepository;
import com.imjjh.common.annotation.IntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@IntegrationTest
class AuthServiceTest {

    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @ParameterizedTest
    @CsvSource({
            "test_user1, Password123!, 장준호, user1@github.com",
            "test_user2, Password123!, 준호, user2@github.com",
            "test_user3, Password123!, 장, user3@github.com"
    })
    @DisplayName("다양한 입력값으로 회원가입 성공 검증")
    void 회원가입_성공_1(String username, String password, String nickname, String email) {
        // given
        RegisterRequestDto registerRequestDto = RegisterRequestDto.builder()
                .nickname(nickname)
                .username(username)
                .password(password)
                .email(email)
                .build();

        // when
        authService.register(registerRequestDto);
        Optional<UserEntity> savedUser = userRepository.findByUsername(username);

        // then
        assertThat(savedUser).isPresent();
        assertThat(savedUser.get().getEmail()).isEqualTo(email);

    }

}