package com.imjjh.Dibs.config;

import com.imjjh.Dibs.auth.JwtTokenProvider;
import com.imjjh.Dibs.auth.handler.OAuth2LoginFailureHandler;
import com.imjjh.Dibs.auth.handler.OAuth2LoginSuccessHandler;
import com.imjjh.Dibs.auth.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

        private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
        private final JwtTokenProvider jwtTokenProvider;
        private final OAuth2LoginFailureHandler oAuth2LoginFailureHandler;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http, CustomOAuth2UserService customOAuth2UserService) throws Exception {
                http
                        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                        .csrf(csrf-> csrf
                                .csrfTokenRepository(cookieCsrfTokenRepository())
                                .ignoringRequestMatchers("/oauth2/**", "/login/**", "/api/auth/**" ) // 인증 없이 접근 가능한 경로 CSRF 검사 제외 (로그인 전 등)
                        )
                        .httpBasic(AbstractHttpConfigurer::disable)
                        .formLogin(AbstractHttpConfigurer::disable)

                        // 스프링 시큐리티는 기본적으로 세션을 사용
                        // JWT 사용시 세션을 아예 생성하지 않도록 (Stateless) 설정
                        .sessionManagement(session -> session
                                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                        .authorizeHttpRequests(auth -> auth
                                        // 로그인 이전 허용 페이지
                                        // 소셜 로그인 관련 URL과 로그인 페이지
                                        .requestMatchers("/oauth2/**", "/login/**", "/api/auth/**").permitAll()
                                        // 그외 모든 요청은 인증된 사용자만 접근 가능
                                        .anyRequest().authenticated())

                        .oauth2Login(oauth2 -> oauth2
                                        .userInfoEndpoint(userInfo -> userInfo
                                                        .userService(customOAuth2UserService))
                                        .successHandler(oAuth2LoginSuccessHandler)
                                        .failureHandler(oAuth2LoginFailureHandler))

                        .exceptionHandling(exceptionHandling-> exceptionHandling.authenticationEntryPoint(((request, response, authException) -> {
                                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                response.setContentType("application/json;charset=UTF-8");
                                response.getWriter().write("{\\\"status\\\":401,\\\"message\\\":\\\"Unauthorized\\\"}");
                        })))

                        .addFilterAfter(new CsrfCookieFilter(), UsernamePasswordAuthenticationFilter.class) // csrf 필터는 jwt 앞이든 뒤든 크게 상관없음?

                        .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(
                                List.of("http://localhost:3000", "http://127.0.0.1:3000"));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*")); // 모든 헤더 허용
                configuration.setAllowCredentials(true); // 쿠키, 인증 정보 허용

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration); // 내 서버 모든 URL에 위 규칙 적용
                return source;
        }


        /**
         * withHttpOnlyFalse()는 내부적으로 CookieCsrfTokenRepository를 생성하고, 쿠키 이름은 XSRF-TOKEN, HttpOnly는 false로 자동 설정해주는 메서드입니다.
         * @return
         */
        @Bean
        public CookieCsrfTokenRepository cookieCsrfTokenRepository() {
                return CookieCsrfTokenRepository.withHttpOnlyFalse();
        }


        /**
         * password 암호화를 위한 encoder
         * @return
         */
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }


}
