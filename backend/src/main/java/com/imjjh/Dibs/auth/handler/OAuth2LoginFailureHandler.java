package com.imjjh.Dibs.auth.handler;

import com.imjjh.Dibs.common.dto.ApiResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * OAuth2 로그인 실패 핸들러
 *
 * Spring Security(Filter) 단계는 스프링 컨트롤러보다 앞단, 더 로우 레벨에서 동작하기에 어쩔 수 없이 서블릿 API를 사용해야함 (ex: response.getWriter())
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginFailureHandler implements AuthenticationFailureHandler {
    private final ObjectMapper objectMapper; // json 변환용

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.error("OAuth2 Login Failure: {}", exception.getMessage());

        // 응답 설정
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        response.setContentType("application/json;charset=UTF-8");

        ApiResponse<Void> apiResponse = ApiResponse.of("소셜 로그인에 실패했습니다: " + exception.getMessage(), null);

        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));

    }

}
