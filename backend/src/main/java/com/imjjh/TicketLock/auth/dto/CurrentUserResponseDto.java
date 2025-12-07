package com.imjjh.TicketLock.auth.dto;

import com.imjjh.TicketLock.auth.user.UserEntity;
import java.util.List;

public record CurrentUserResponseDto(Long id, String email, String name, List<String> roles) {

    public static CurrentUserResponseDto of(UserEntity userEntity) {

        List<String> roles = userEntity.getRoles().stream()
                .map(userRole -> userRole.getRole().getKey())
                .toList();

        return new CurrentUserResponseDto(
                userEntity.getId(),
                userEntity.getEmail(),
                userEntity.getNickName(),
                roles);
    }
}
