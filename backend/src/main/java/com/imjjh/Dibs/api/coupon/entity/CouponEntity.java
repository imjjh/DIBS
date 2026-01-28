package com.imjjh.Dibs.api.coupon.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.imjjh.Dibs.common.BaseTimeEntity;

@SQLDelete(sql = "UPDATE coupon_entity SET is_deleted = true where id = ?")
@SQLRestriction("is_deleted = false")
public class CouponEntity extends BaseTimeEntity {

}
