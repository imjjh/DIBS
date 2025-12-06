package com.imjjh.TicketLock.user;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 *  각 유저의 권한 정보를 저장하는 테이블
 *
 */
@Entity
@Getter
@NoArgsConstructor
public class UserRole {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private UserEntity user;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RoleType role;

    @Builder
    public UserRole(UserEntity user, RoleType role){
        this.user=user;
        this.role=role;
    }

}
