package com.imjjh.Dibs.auth.user;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
public class CustomUserDetails implements UserDetails, OAuth2User {
    private final UserEntity userEntity;
    private Map<String, Object> attributes;

    // 일반 로그인 생성자
    public CustomUserDetails(UserEntity userEntity) {
        this.userEntity = userEntity;
    }

    // OAuth2 로그인 생성자
    public CustomUserDetails(UserEntity userEntity, Map<String, Object> attributes) {
        this.userEntity = userEntity;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    // 권한 정보 가져오기
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return userEntity.getRoles().stream()
                .map(userRole -> new SimpleGrantedAuthority(userRole.getRole().getKey()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return userEntity.getPassword();
    }

    @Override
    public String getUsername() {
        return userEntity.getUsername();
    }

    // PK (sequence)
    @Override
    public String getName() {
        return userEntity.getId().toString();
    }
}
