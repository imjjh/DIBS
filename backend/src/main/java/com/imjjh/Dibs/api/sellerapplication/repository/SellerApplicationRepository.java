package com.imjjh.Dibs.api.sellerapplication.repository;

import com.imjjh.Dibs.api.sellerapplication.entity.SellerApplicationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SellerApplicationRepository extends JpaRepository<SellerApplicationEntity, Long>, SellerApplicationRepositoryCustom {
    Optional<SellerApplicationEntity> findByUserId(Long userId);
    boolean existsByBusinessNumber(String businessNumber);
}
