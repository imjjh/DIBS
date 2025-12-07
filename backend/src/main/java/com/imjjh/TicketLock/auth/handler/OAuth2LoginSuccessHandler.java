package com.imjjh.TicketLock.auth.handler;

import com.imjjh.TicketLock.auth.JwtTokenProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;

    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        // 로그인 성공 로그 출력
        log.info("OAuth2 login 성공! 토큰 생성 시작");

        // 토큰 생성
        String accessToken = jwtTokenProvider.createToken(authentication);
        log.info("생성된 Access Token: {}", accessToken);

        // 쿠키 생성
        ResponseCookie cookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("Lax")
                .maxAge(60 * 60)
                .build();

        // TODO: CSRF 방어 로직
        response.addHeader("Set-Cookie", cookie.toString());

        // 리다이렉트 수행
        getRedirectStrategy().sendRedirect(request, response, "http://localhost:3000/oauth/callback");

    }

}
