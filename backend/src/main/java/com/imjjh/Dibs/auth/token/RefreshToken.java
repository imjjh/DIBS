package com.imjjh.Dibs.auth.token;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@RedisHash(value = "refreshToken")
public class RefreshToken {

    // redis는 @Id가 이미 존재하는 경우 덮어쓰고, 없는 경우 생성
    @Id
    private String userId; // key
    private String token; // value;

    @TimeToLive
    private Long expiration;
}
