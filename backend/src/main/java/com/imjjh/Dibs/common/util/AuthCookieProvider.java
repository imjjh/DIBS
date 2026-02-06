package com.imjjh.Dibs.common.util;

import com.imjjh.Dibs.auth.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthCookieProvider {
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${jwt.cookie.secure:false}")
    private boolean secure;

    public ResponseCookie createAccessTokenCookie(String token) {
        return createCookie("accessToken", token, jwtTokenProvider.getAccessTokenValiditySeconds());
    }

    public ResponseCookie createRefreshTokenCookie(String token) {
        return createCookie("refreshToken", token, jwtTokenProvider.getRefreshTokenValiditySeconds());
    }

    public ResponseCookie createDeleteCookie(String name) {
        return createCookie(name, "", 0L);
    }

    private ResponseCookie createCookie(String name, String value, long maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
    }
}
