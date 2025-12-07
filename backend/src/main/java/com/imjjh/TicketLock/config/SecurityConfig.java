package com.imjjh.TicketLock.config;

import com.imjjh.TicketLock.auth.JwtAuthenticationFilter;
import com.imjjh.TicketLock.auth.JwtTokenProvider;
import com.imjjh.TicketLock.auth.handler.OAuth2LoginFailureHandler;
import com.imjjh.TicketLock.auth.handler.OAuth2LoginSuccessHandler;
import com.imjjh.TicketLock.auth.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
        private final JwtTokenProvider jwtTokenProvider;
        private final OAuth2LoginFailureHandler oAuth2LoginFailureHandler;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http, CustomOAuth2UserService customOAuth2UserService)
                        throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(AbstractHttpConfigurer::disable)
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
}
