package com.imjjh.Dibs.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

/**
 * 검색 요청시 페이징이 필요한 경우 상속해 사용할 인터페이스
 * API 통신은 1-based
 */
public interface PageableRequest {

    @Schema(description = "페이지", example = "1")
    Integer page();

    @Schema(description = "한 페이지당 보여줄 컨텐츠의 갯수", example = "10")
    Integer size();

    default Pageable toPageable(){
        int p = (page() == null || page() < 1) ? 0 : page()-1;  // 1 based -> 0-based로 변환
        int s = (size() == null || size() < 1) ? 10 : Math.min(size(),200); // 1미만일 경우 10, 그외 입력값과 200 중 작은 값으로 선택
        return PageRequest.of(p,s);
    }
}
