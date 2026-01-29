package com.imjjh.Dibs.api.coupon.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.imjjh.Dibs.common.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@SQLDelete(sql = "UPDATE coupon_entity SET deleted_at = now() where id = ?")
@SQLRestriction("deleted_at IS NULL")
@Entity
public class CouponEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
