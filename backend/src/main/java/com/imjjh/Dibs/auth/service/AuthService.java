package com.imjjh.Dibs.auth.service;

import com.imjjh.Dibs.auth.JwtTokenProvider;
import com.imjjh.Dibs.auth.dto.LoginRequestDto;
import com.imjjh.Dibs.auth.dto.LoginResponseDto;
import com.imjjh.Dibs.auth.dto.RegisterRequestDto;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.auth.user.RoleType;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.auth.user.repository.UserRepository;
import com.imjjh.Dibs.common.exception.BusinessException;
import com.imjjh.Dibs.auth.exception.AuthErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 사용 중인 ID 확인
     * 
     * @param username
     */
    public void validateUsername(String username) {
        Optional<UserEntity> optionalUserEntity = userRepository.findByUsername(username);
        if (optionalUserEntity.isPresent()) {
            throw new BusinessException(AuthErrorCode.DUPLICATE_USERNAME);
        }
    }

    public void validateEmail(String email) {
        Optional<UserEntity> optionalUserEntity = userRepository.findByEmail(email);
        if (optionalUserEntity.isPresent()) {
            throw new BusinessException(AuthErrorCode.DUPLICATE_EMAIL);
        }
    }

    /**
     * 회원가입
     * 
     * @param requestDto
     */
    public void register(RegisterRequestDto requestDto) {

        // 아이디 & 이메일 중복 체크
        validateUsername(requestDto.username());
        validateEmail(requestDto.email());

        UserEntity entity = RegisterRequestDto.toEntity(requestDto);

        // 비밀번호 해싱
        String encodedPassword = passwordEncoder.encode(requestDto.password());

        // 해싱된 비밀번호와 권한 추가
        entity.setPassword(encodedPassword);
        entity.addRole(RoleType.USER);

        userRepository.save(entity);
    }

    /**
     * 로그인
     *
     * @param requestDto
     * @return
     */
    public LoginResponseDto login(LoginRequestDto requestDto) {
        UserEntity userEntity = userRepository.findByUsername(requestDto.username())
                .orElseThrow(() -> new BusinessException(AuthErrorCode.LOGIN_FAILED));

        // 비밀 번호 검증
        boolean matches = passwordEncoder.matches(requestDto.password(), userEntity.getPassword());
        if (!matches) {
            throw new BusinessException(AuthErrorCode.LOGIN_FAILED);
        }

        // 토큰 생성을 위한 인증 객체 생성
        CustomUserDetails userDetails = new CustomUserDetails(userEntity);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                userDetails.getAuthorities());

        // access & refresh token 생성
        String accessToken = jwtTokenProvider.createAccessToken(authentication);
        String refreshToken = jwtTokenProvider.createRefreshToken(authentication);

        return new LoginResponseDto(accessToken, refreshToken, userEntity);
    }
}
