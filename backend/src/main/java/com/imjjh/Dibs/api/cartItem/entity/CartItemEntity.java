package com.imjjh.Dibs.api.cartItem.entity;

import com.imjjh.Dibs.common.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.Id;

@SQLDelete(sql = "UPDATE cart_item_entity SET deleted_at = now() where id = ?")
@SQLRestriction("deleted_at IS NULL")
@Entity
public class CartItemEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

}
