package com.imjjh.Dibs.auth.service;

import com.imjjh.Dibs.auth.dto.oauth2.KakaoResponse;
import com.imjjh.Dibs.auth.dto.oauth2.NaverResponse;
import com.imjjh.Dibs.auth.dto.oauth2.OAuth2Response;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import com.imjjh.Dibs.auth.user.RoleType;
import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.auth.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 기본 서비스로 유저 정보를 가져옴
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // 현재 로그인 진행 중인 서비스 구분 (naver, kakao 등)
        String registration = userRequest.getClientRegistration().getRegistrationId();

        // DTO 객체 생성
        OAuth2Response oAuth2Response = null;
        // 각 provider의 맞게 파싱하여 nickname, email 등 꺼내기
        if (registration.equals("kakao")) {
            oAuth2Response = new KakaoResponse(oAuth2User.getAttributes());
        } else if (registration.equals("naver")) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        }
        // TODO: google
        else if (registration.equals("google")) {
            throw new OAuth2AuthenticationException(new OAuth2Error("400"), "구글 로그인은 아직 지원하지 않습니다."); // -> failer
                                                                                                      // handler
        } else {
            throw new OAuth2AuthenticationException(new OAuth2Error("400"), "지원하지 않는 소셜 로그인입니다."); // -> failer handler
        }

        // 유저 저장 또는 업데이트
        UserEntity userEntity = saveOrUpdate(oAuth2Response);

        // UserRole 리스트를 시큐리티가 이해하는 GrandAuthority로 변환
        // List<UserRole> -> List<GrandAuthoritiy>
        List<GrantedAuthority> authorities = userEntity.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRole().getKey()))
                .collect(Collectors.toList());

        return new CustomUserDetails(userEntity, oAuth2User.getAttributes());

    }

    /**
     * 회원이 존재하면 그냥 리턴하고, 존재하지 않으면 DB에 회원 정보를 등록하는 메서드
     * 
     * @param oAuth2Response
     * @return userEntity
     */
    private UserEntity saveOrUpdate(OAuth2Response oAuth2Response) {

        String provider = oAuth2Response.getProvider(); // kakao
        String providerId = oAuth2Response.getProviderId(); // 123456

        UserEntity userEntity = userRepository.findByProviderAndProviderId(provider, providerId).orElse(null);

        // 첫 로그인 (회원 가입이 필요한 경우)
        if (userEntity == null) {
            String email = oAuth2Response.getEmail();
            String nickname = oAuth2Response.getName();
            String username = provider + "_" + providerId; // username은 중복되지 않도록 provider_providerId 형식으로 생성 (ex:
                                                           // naver_123456)

            log.info("새로운 소셜 로그인 유저 가입: {}", username);

            UserEntity newUser = UserEntity.builder()
                    .username(username) // 내부용 ID (springSecurity 필수)
                    .nickName(nickname) // 화면 표시용 (kakao Nickname)
                    .email(email)
                    .provider(provider)
                    .providerId(providerId)
                    .build();

            newUser.addRole(RoleType.USER); // 기본 유저

            return userRepository.save(newUser);
        }

        // 이미 게정이 있는 경우
        log.info("기존 유저 로그인: {}", userEntity.getUsername());
        return userEntity;
    }

}
