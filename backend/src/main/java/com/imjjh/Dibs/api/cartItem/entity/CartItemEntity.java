package com.imjjh.Dibs.api.cartItem.entity;

import com.imjjh.Dibs.common.BaseTimeEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.Id;

@SQLDelete(sql = "UPDATE cart_item_entity SET is_deleted = true where id = ?")
@SQLRestriction("is_deleted = false")
@Entity
public class CartItemEntity extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

}
