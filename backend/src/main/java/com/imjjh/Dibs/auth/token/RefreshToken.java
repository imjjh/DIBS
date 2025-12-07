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
@RedisHash(value = "refreshToken",timeToLive = 60*60*24*7)
public class RefreshToken {

    @Id
    private String userId; // key

    private String token; // value;

}
