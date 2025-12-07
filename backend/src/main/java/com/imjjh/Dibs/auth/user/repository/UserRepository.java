package com.imjjh.Dibs.auth.user.repository;

import com.imjjh.Dibs.auth.user.UserEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByProviderAndProviderId(String provider, String providerId);

    Optional<UserEntity> findByUsername(String username);

    // 유저 정보 조회시 roles도 같이 가져오기
    @EntityGraph(attributePaths = "roles")
    Optional<UserEntity> findWithRolesById(Long id);
}
