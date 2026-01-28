package com.imjjh.Dibs.api.image.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.imjjh.Dibs.common.dto.ApiResponse;
import com.imjjh.Dibs.common.dto.ValidationMessage;
import com.imjjh.Dibs.common.service.S3Service;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {
    private final S3Service s3Service;

    @Operation(summary = "이미지 업로드", description = "이미지를 S3에 업로드하고 URL을 반환합니다.")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadImage(@RequestPart("file") MultipartFile file) {

        String imageUrl = s3Service.uploadFile(file);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(ValidationMessage.SUCCESS, imageUrl));
    }

}
