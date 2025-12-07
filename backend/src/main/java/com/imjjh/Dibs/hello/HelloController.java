package com.imjjh.Dibs.hello;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class HelloController {

    @GetMapping("/hello")
    public String hello(){
        return "hello122";
    }

    // 1. 로그인 안 해도 들어올 수 있는 곳
    @GetMapping("/log")
    public String freePass() {
        return "로그인 없이도 보입니다!";
    }

    // 2. 로그인(JWT 토큰) 해야만 들어올 수 있는 곳
    @GetMapping("/api/test")
    public String securedApi(Authentication authentication) {
        // authentication 안에 우리가 넣은 유저 정보가 들어있음
        return "인증 성공! 당신의 ID(Subject): " + authentication.getName();
    }
}
