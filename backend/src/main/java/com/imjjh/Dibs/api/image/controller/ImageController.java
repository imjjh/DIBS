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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "이미지 업로드 관련 API", description = "S3를 이용한 이미지 업로드 기능을 제공합니다.")
@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {
    private final S3Service s3Service;

    /**
     * TODO: 유령 파일이 생길 수 있음
     * ex) (업로드 성공 && 상품 등록 실패), (상품 이미지 수정을 위한 업로드 && 기존 사진 삭제 실패)
     * 
     * @param file
     * @return
     */
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "이미지 업로드", description = "이미지를 S3에 업로드하고 URL을 반환합니다.")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<String> uploadImage(@RequestPart("file") MultipartFile file) {
        return ApiResponse.success(s3Service.uploadFile(file));
    }

    /*
     * @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
     * 
     * @Operation(summary = "이미지 삭제")
     * 
     * @DeleteMapping
     * public ResponseEntity<ApiResponse<Void>>
     * deleteImageByUrl(@RequestParam("file") @NotBlank String imageUrl) {
     * s3Service.deleteImageFile(imageUrl);
     * 
     * return
     * ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of(ValidationMessage.
     * SUCCESS, null));
     * }
     */

}
