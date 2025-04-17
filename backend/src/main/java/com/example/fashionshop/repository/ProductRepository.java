package com.example.fashionshop.repository;

import com.example.fashionshop.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(value = """
            SELECT DISTINCT p.*
            FROM product p
            WHERE (:gender IS NULL OR p.gender = CAST(:gender AS gender_type))
            AND (:mainCategoryId IS NULL OR p.main_category_id = :mainCategoryId)
            AND (:subCategoryId IS NULL OR p.sub_category_id = :subCategoryId)
            AND (COALESCE(:sizes, '{}') = '{}' OR p.size && CAST(:sizes AS text[]))
            AND (COALESCE(:colors, '{}') = '{}' OR p.color && CAST(:colors AS text[]))
            AND (:priceMin IS NULL OR p.price >= :priceMin)
            AND (:priceMax IS NULL OR p.price <= :priceMax)
            """, countQuery = """
            SELECT COUNT(DISTINCT p.id)
            FROM product p
            WHERE (:gender IS NULL OR p.gender = CAST(:gender AS gender_type))
            AND (:mainCategoryId IS NULL OR p.main_category_id = :mainCategoryId)
            AND (:subCategoryId IS NULL OR p.sub_category_id = :subCategoryId)
            AND (COALESCE(:sizes, '{}') = '{}' OR p.size && CAST(:sizes AS text[]))
            AND (COALESCE(:colors, '{}') = '{}' OR p.color && CAST(:colors AS text[]))
            AND (:priceMin IS NULL OR p.price >= :priceMin)
            AND (:priceMax IS NULL OR p.price <= :priceMax)
            """, nativeQuery = true)
    Page<Product> findByFilters(
            @Param("gender") String gender,
            @Param("mainCategoryId") Long mainCategoryId,
            @Param("subCategoryId") Long subCategoryId,
            @Param("sizes") String[] sizes,
            @Param("colors") String[] colors,
            @Param("priceMin") Double priceMin,
            @Param("priceMax") Double priceMax,
            Pageable pageable);
}