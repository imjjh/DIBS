package com.imjjh.Dibs.api.coupon.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.imjjh.Dibs.api.coupon.entity.CouponEntity;

public interface CouponRepository extends JpaRepository<CouponEntity, Long> {

}
