package com.imjjh.Dibs.auth.service;

import com.imjjh.Dibs.auth.JwtTokenProvider;
import com.imjjh.Dibs.auth.dto.RegisterRequestDto;
import com.imjjh.Dibs.auth.exception.AuthErrorCode;
import com.imjjh.Dibs.auth.user.RoleType;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.auth.user.repository.UserRepository;
import com.imjjh.Dibs.common.exception.BusinessException;
import com.imjjh.common.annotation.UnitTest;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;

@UnitTest
@ExtendWith(MockitoExtension.class)
class AuthServiceUnitTest {

        @InjectMocks
        private AuthService authService;

        @Mock
        private UserRepository userRepository;
        @Mock
        private PasswordEncoder passwordEncoder;
        @Mock
        private JwtTokenProvider jwtTokenProvider;

        @Test
        @DisplayName("회원가입 성공")
        void 회원가입_성공() {
                // given
                ArgumentCaptor<UserEntity> userCaptor = ArgumentCaptor.forClass(UserEntity.class);

                RegisterRequestDto registerRequestDto = RegisterRequestDto.builder()
                                .username("admin")
                                .password("Password123!@")
                                .nickname("imadmin")
                                .email("admin123@dibs.com")
                                .build();

                given(userRepository.findByUsername(any())).willReturn(Optional.empty()); // username 중복 없음
                given(userRepository.findByEmail(any())).willReturn(Optional.empty()); // email 중복 없음
                given(passwordEncoder.encode(any())).willReturn("encode_pw"); // 해싱된 비밀번호

                // when
                authService.register(registerRequestDto);

                // then
                verify(userRepository).save(userCaptor.capture());
                UserEntity savedUser = userCaptor.getValue();

                assertThat(savedUser.getUsername()).isEqualTo("admin");
                assertThat(savedUser.getPassword()).isEqualTo("encode_pw");
                assertThat(savedUser.getRoles())
                                .anyMatch(r -> r.getRole().equals(RoleType.USER));
        }

        @Test
        @DisplayName("회원가입 실패 중복아이디")
        void 회원가입_실패_중복아이디() {

                // given
                RegisterRequestDto registerRequestDto = RegisterRequestDto.builder()
                                .username("admin")
                                .password("Password123!@")
                                .nickname("imadmin")
                                .email("admin123@dibs.com")
                                .build();

                given(userRepository.findByUsername(any())).willReturn(Optional.of(new UserEntity()));

                // when & then
                assertThatThrownBy(() -> authService.register(registerRequestDto))
                                .isInstanceOf(BusinessException.class)
                                .hasFieldOrPropertyWithValue("errorCode", AuthErrorCode.DUPLICATE_USERNAME);

                verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("회원가입 실패 중복이메일")
        void 회원가입_실패_중복이메일() {

                // given
                RegisterRequestDto registerRequestDto = RegisterRequestDto.builder()
                                .username("admin")
                                .password("Password123!@")
                                .nickname("imadmin")
                                .email("admin123@dibs.com")
                                .build();

                given(userRepository.findByEmail(any())).willReturn(Optional.of(new UserEntity()));

                // when & then
                assertThatThrownBy(() -> authService.register(registerRequestDto))
                                .isInstanceOf(BusinessException.class)
                                .hasFieldOrPropertyWithValue("errorCode", AuthErrorCode.DUPLICATE_EMAIL);

                verify(userRepository, never()).save(any());
        }

}