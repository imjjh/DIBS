package com.imjjh.Dibs.common.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.imjjh.Dibs.common.exception.BusinessException;
import com.imjjh.Dibs.common.exception.CommonErrorCode;

import io.awspring.cloud.s3.S3Template;

@Service
public class S3Service {

    private final S3Template s3Template;
    private final String bucket;

    public S3Service(S3Template s3Template, @Value("${spring.cloud.aws.s3.bucket}") String bucket) {
        this.s3Template = s3Template;
        this.bucket = bucket;
    }

    public String uploadFile(MultipartFile file) {

        validateImageFile(file);
        // 파일 이름 생성 (UUID_원본파일명)
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            // S3 업로드
            var S3Resource = s3Template.upload(bucket, fileName, file.getInputStream());

            return S3Resource.getURL().toString();
        } catch (IOException e) {
            throw new RuntimeException("s3 파일 업로드 실패", e);
        }

    }

    /**
     * s3 파일을 삭제합니다.
     * 
     * @param imageUrl
     */
    public void deleteImageFile(String imageUrl) {
        String key = imageUrl.substring(imageUrl.lastIndexOf("/") + 1); // URL에서 마지막 '/' 이후 파일명만 추출
        s3Template.deleteObject(bucket, key);
    }

    private void validateImageFile(MultipartFile file) {
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
    }

}
