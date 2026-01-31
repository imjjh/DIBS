package com.imjjh.Dibs.config;

import com.imjjh.Dibs.auth.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT 인증 필터
 * OncePerRequestFilter 상속으로 요청당 한 번만 실행 보장
 *
 */
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Request Header에서 토큰을 추출하여 유효성 검사 후 SecurityContext에 Authentication 객체를 저장합니다.
     * 
     * @param request
     * @param response
     * @param filterChain
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Request Header 에서 토큰 추출
        String token = resolveToken(request);

        if (token != null ) {
            // 토큰 유효성 검사
            jwtTokenProvider.validateToken(token);
            // 토큰으로부터 유저 정보를 받아옵니다.
            Authentication authentication = jwtTokenProvider.getAuthentication(token);
            // SecurityContext에 Authentication 객체를 저장합니다. (인증 완료 처리)
            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.debug("Security Context에 '{}' 인증 정보를 저장했습니다, uri: {}", authentication.getName(),
                    request.getRequestURI());
        }
        // 다음 필터로 요청 넘기기
        filterChain.doFilter(request, response);
    }

    /**
     * 쿠키를 확인하여
     * accessToken이 있는지 확인합니다.
     * 
     * @param request
     * @return
     */
    private String resolveToken(HttpServletRequest request) {
        // 쿠키 확인
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

}
