package com.imjjh.Dibs.auth.handler;

import com.imjjh.Dibs.auth.JwtTokenProvider;
import com.imjjh.Dibs.auth.token.RefreshToken;
import com.imjjh.Dibs.auth.token.repository.RefreshTokenRepository;
import com.imjjh.Dibs.auth.user.CustomUserDetails;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import com.imjjh.Dibs.common.util.AuthCookieProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

        private final JwtTokenProvider jwtTokenProvider;
        private final RefreshTokenRepository refreshTokenRepository;
        private final AuthCookieProvider authCookieProvider;

        public void onAuthenticationSuccess(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        Authentication authentication)
                        throws IOException, ServletException {

                // 로그인 성공 로그 출력
                log.info("OAuth2 login 성공! 토큰 생성 시작");

                // 토큰 생성
                String accessToken = jwtTokenProvider.createAccessToken(authentication);
                String refreshToken = jwtTokenProvider.createRefreshToken(authentication);

                // 인증정보에서 userId 꺼내기
                CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
                String userId = userDetails.getName();

                // refreshToken redis에 저장
                RefreshToken redisToken = new RefreshToken(userId, refreshToken,
                                jwtTokenProvider.getRefreshTokenValiditySeconds());
                refreshTokenRepository.save(redisToken);
                log.info("Refresh Token Redis 저장 완료: {}", userId);

                response.addHeader(HttpHeaders.SET_COOKIE,
                                authCookieProvider.createAccessTokenCookie(accessToken).toString());
                response.addHeader(HttpHeaders.SET_COOKIE,
                                authCookieProvider.createRefreshTokenCookie(refreshToken).toString());

                // 리다이렉트 수행
                String targetUrl = "http://" + request.getServerName() + ":3000/oauth/callback";
                getRedirectStrategy().sendRedirect(request, response, targetUrl);

        }

}
