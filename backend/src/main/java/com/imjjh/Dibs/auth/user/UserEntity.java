package com.imjjh.Dibs.auth.user;

import com.imjjh.Dibs.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * 유저 엔티티 클래스
 *
 */
@Entity
@NoArgsConstructor
@Getter
public class UserEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = true) // 일반 로그인 시 null
    private String provider; // kakao, naver

    @Column(length = 100, nullable = true, unique = true) // 일반 로그인 시 null
    private String providerId; // kakaoId, naverId

    @Column(length = 100)
    private String nickname;

    @Column(length = 100)
    private String username;

    @Setter
    @Column(length = 100, nullable = true) // 소셜 로그인 시 null
    private String password;

    @Column(length = 100, nullable = true, unique = true) // 소셜 로그인 시 null
    private String email;

    // ==========================================
    // [추가] 권한 목록 (1:N 관계)
    // ==========================================
    // mappedBy = "user": UserRole 클래스의 'user' 필드가 관계의 주인이라는 뜻
    // cascade = CascadeType.ALL: 유저를 저장/삭제하면 권한도 같이 저장/삭제
    // orphanRemoval = true: 리스트에서 권한을 제거하면 DB에서도 삭제됨
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserRole> roles = new ArrayList<>();

    /**
     * 권한 추가 메서드
     * 
     * @param roleType
     */
    public void addRole(RoleType roleType) {
        // 이미 해당 권한을 가지고 있다면 중복 추가 하지 않음
        boolean hasRole = this.roles.stream()
                .anyMatch(r -> r.getRole().equals(roleType));

        if (hasRole)
            return;

        UserRole userRole = UserRole.builder()
                .user(this)
                .role(roleType)
                .build();

        this.roles.add(userRole);
    }

    /**
     * OAuth2 회원가입
     * 
     * @param provider
     * @param providerId
     * @param nickName
     * @param username
     * @param email
     */
    @Builder(builderMethodName = "socialBuilder")
    public UserEntity(String provider, String providerId, String nickname, String username, String email) {
        this.provider = provider;
        this.providerId = providerId;
        this.nickname = nickname;
        this.username = username;
        this.email = email;
        this.password = null;
    }

    /**
     * 일반 회원가입
     * 
     * @param nickName
     * @param username
     * @param email
     * @param password
     */
    @Builder
    public UserEntity(String nickname, String username, String email, String password) {
        this.provider = null;
        this.providerId = null;
        this.nickname = nickname;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
