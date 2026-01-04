package com.imjjh.Dibs.auth.dto;

import com.imjjh.Dibs.auth.user.UserEntity;
import java.util.List;

/**
 * 현재 유저 정보를 반환 해주는 dto로 감싸 반환해주는 클래스
 * 
 * @param id
 * @param email
 * @param name
 * @param roles
 */
public record CurrentUserResponseDto(Long id, String email, String name, List<String> roles) {

    public static CurrentUserResponseDto of(UserEntity userEntity) {

        List<String> roles = userEntity.getRoles().stream()
                .map(userRole -> userRole.getRole().getKey())
                .toList();

        return new CurrentUserResponseDto(
                userEntity.getId(),
                userEntity.getEmail(),
                userEntity.getNickname(),
                roles);
    }

}
