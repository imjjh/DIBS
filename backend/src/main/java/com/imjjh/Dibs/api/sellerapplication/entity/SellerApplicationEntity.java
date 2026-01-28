package com.imjjh.Dibs.api.sellerapplication.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.imjjh.Dibs.auth.user.UserEntity;
import com.imjjh.Dibs.common.BaseTimeEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@SQLDelete(sql = "UPDATE seller_application_entity SET is_deleted = true where id = ?")
@SQLRestriction("is_deleted = false")
public class SellerApplicationEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "applied_user")
    @Schema(description = "신청한 유저")
    private UserEntity user;

    @Column(nullable = false)
    @Schema(description = "상호명")
    private String businessName;

    @Column(unique = true, nullable = false)
    @Schema(description = "사업자 번호 (Mock)")
    private String businessNumber;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Schema(description = "신청 처리 상태")
    private ApplicationStatus applicationStatus = ApplicationStatus.PENDING; // 기본값 설정

    @Schema(nullable = true, description = "거절 시 사유")
    private String rejectReason;

    /**
     * 신청 승인
     */
    public void approve() {
        this.applicationStatus = ApplicationStatus.APPROVED;
    }

    /**
     * 신청 거절
     * 
     * @param rejectReason
     */
    public void reject(String rejectReason) {
        this.applicationStatus = ApplicationStatus.REJECTED;
        this.rejectReason = rejectReason;
    }

    /**
     * 거절 후 재신청
     * 
     * @param businessName
     * @param businessNumber
     */
    public void reapply(String businessName, String businessNumber) {
        this.businessName = businessName;
        this.businessNumber = businessNumber;

        this.applicationStatus = ApplicationStatus.PENDING;
        this.rejectReason = null;
    }

}
