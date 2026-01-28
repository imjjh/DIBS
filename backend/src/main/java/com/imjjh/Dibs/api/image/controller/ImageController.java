package com.imjjh.Dibs.api.image.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.imjjh.Dibs.common.dto.ApiResponse;
import com.imjjh.Dibs.common.dto.ValidationMessage;
import com.imjjh.Dibs.common.exception.BusinessException;
import com.imjjh.Dibs.common.exception.CommonErrorCode;
import com.imjjh.Dibs.common.service.S3Service;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {
    private final S3Service s3Service;

    /**
     * TODO: 유령 파일이 생길 수 있음 ex) 업로드 성공 && 상품 등록 실패
     * 
     * @param file
     * @return
     */
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    @Operation(summary = "이미지 업로드", description = "이미지를 S3에 업로드하고 URL을 반환합니다.")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadImage(@RequestPart("file") MultipartFile file) {

        // MIME 검사
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessException(CommonErrorCode.INVALID_TYPE_VALUE);
        }

        // 용량 검사 // 5MB
        long maxSize = 5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new BusinessException(CommonErrorCode.INVALID_INPUT_VALUE);
        }

        String imageUrl = s3Service.uploadFile(file);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(ValidationMessage.SUCCESS, imageUrl));
    }

}
