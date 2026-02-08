package com.imjjh.Dibs.config;

import org.redisson.api.RedissonClient;
import org.redisson.jcache.configuration.RedissonConfiguration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.cache.CacheManager;
import javax.cache.Caching;
import javax.cache.spi.CachingProvider;

@Configuration
@EnableCaching
public class RateLimitConfig {

    @Bean(name = "rateLimitCacheManager")
    public CacheManager rateLimitCacheManager(RedissonClient redissonClient) {
        // Redisson 기반의 JCache 제공자 로드
        CachingProvider provider = Caching.getCachingProvider();
        CacheManager manager = provider.getCacheManager();

        // Bucket4j에서 사용할 'buckets'라는 이름의 캐시 영역 생성
        if (manager.getCache("buckets") == null) {
            manager.createCache("buckets", RedissonConfiguration.fromInstance(redissonClient));
        }

        return manager;
    }
}
