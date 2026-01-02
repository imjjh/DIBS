package com.imjjh.Dibs.api.product.repository;

import com.imjjh.Dibs.api.product.entity.ProductEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long>, ProductRepositoryCustom {
    @EntityGraph(attributePaths = "seller")
    Optional<ProductEntity> findById(Long id);
}
