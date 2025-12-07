package com.imjjh.Dibs.config;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class CsrfCookieFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // CSRF 토큰을 강제로 로드하여 쿠키에 포함되도록함
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            csrfToken.getToken(); // 이 메서드가 호출되어야 토큰이 생성되고 쿠키에 저장됨 // Spring Security의 Lazy전략으로 getToken()하면 호출되는 순간 토큰을 만들기 시작함
        }
        filterChain.doFilter(request,response);
    }
}
