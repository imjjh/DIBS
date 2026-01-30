package com.imjjh.Dibs.common.exception;

import com.imjjh.Dibs.common.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MultipartException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private final String maxRequestSize;

    public GlobalExceptionHandler(@Value("${spring.servlet.multipart.max-request-size:10MB}") String maxRequestSize) {
        this.maxRequestSize = maxRequestSize;
    }

    /**
     * 유효성 검사 실패 메시지
     * 
     * @param e
     * @return
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ApiResponse.of(message, null));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException e) {
        return ResponseEntity.status(e.getErrorCode().getStatus()).body(
                ApiResponse.of(e.getErrorCode().getMessage(), null));
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<ApiResponse<Void>> handleMultipartException(MultipartException e) {
        String message = String.format(CommonErrorCode.FILE_SIZE_EXCEEDED.getMessage(), maxRequestSize);
        return ResponseEntity.status(CommonErrorCode.FILE_SIZE_EXCEEDED.getStatus()).body(
                ApiResponse.of(message, null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleAllException(Exception e) {
        log.error("정의되지 않은 에러 발생: ", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.of(CommonErrorCode.INTERNAL_SERVER_ERROR.getMessage(), null));
    }

}
