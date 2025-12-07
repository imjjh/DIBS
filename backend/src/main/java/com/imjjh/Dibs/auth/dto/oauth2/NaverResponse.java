package com.imjjh.Dibs.auth.dto.oauth2;

import java.util.Map;

public class NaverResponse implements OAuth2Response {
    private final Map<String, Object> attribute;

    public NaverResponse(Map<String, Object> attribute) {
        // 네이버 응답에서 "response" 안에 실제 유저 정보가 있음
        this.attribute = (Map<String, Object>) attribute.get("response");
    }

    @Override
    public String getProvider() {
        return "naver";
    }

    @Override
    public String getProviderId() {
        return attribute.get("id").toString();
    }

    @Override
    public String getEmail() {
        Object email = attribute.get("email");
        return email != null ? email.toString() : null;
    }

    @Override
    public String getName() {
        Object name = attribute.get("name");
        if (name != null)
            return name.toString();
        // name이 없으면 nickname 사용
        Object nickname = attribute.get("nickname");
        return nickname != null ? nickname.toString() : "네이버유저";
    }
}
