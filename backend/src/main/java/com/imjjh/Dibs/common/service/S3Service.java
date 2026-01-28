package com.imjjh.Dibs.common.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

}
