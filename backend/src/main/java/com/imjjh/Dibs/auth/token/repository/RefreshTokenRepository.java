package com.imjjh.Dibs.auth.token.repository;


import com.imjjh.Dibs.auth.token.RefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken,String> {
    // 기

}
