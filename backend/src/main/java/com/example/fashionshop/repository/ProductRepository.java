package com.example.fashionshop.repository;

import com.example.fashionshop.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

        @Query(value = """
                        SELECT DISTINCT p.*
                        FROM product p
                        WHERE (:gendersCsv = '' OR CAST(p.gender AS gender_type) = ANY(CAST(string_to_array(:gendersCsv, ',') AS gender_type[])))
                          AND (:mainCategoryId IS NULL OR p.main_category_id = :mainCategoryId)
                          AND (:subCategoryId IS NULL OR p.sub_category_id = :subCategoryId)
                          AND (:sizesCsv = '' OR p.size && string_to_array(:sizesCsv, ','))
                          AND (:colorsCsv = '' OR p.color && string_to_array(:colorsCsv, ','))
                          AND (:priceMin IS NULL OR p.price >= :priceMin)
                          AND (:priceMax IS NULL OR p.price <= :priceMax)
                        """, countQuery = """
                        SELECT COUNT(DISTINCT p.id)
                        FROM product p
                        WHERE (:gendersCsv = '' OR CAST(p.gender AS gender_type) = ANY(CAST(string_to_array(:gendersCsv, ',') AS gender_type[])))
                          AND (:mainCategoryId IS NULL OR p.main_category_id = :mainCategoryId)
                          AND (:subCategoryId IS NULL OR p.sub_category_id = :subCategoryId)
                          AND (:sizesCsv = '' OR p.size && string_to_array(:sizesCsv, ','))
                          AND (:colorsCsv = '' OR p.color && string_to_array(:colorsCsv, ','))
                          AND (:priceMin IS NULL OR p.price >= :priceMin)
                          AND (:priceMax IS NULL OR p.price <= :priceMax)
                        """, nativeQuery = true)
        Page<Product> findByFilters(
                        @Param("gendersCsv") String gendersCsv,
                        @Param("mainCategoryId") Long mainCategoryId,
                        @Param("subCategoryId") Long subCategoryId,
                        @Param("sizesCsv") String sizesCsv,
                        @Param("colorsCsv") String colorsCsv,
                        @Param("priceMin") Double priceMin,
                        @Param("priceMax") Double priceMax,
                        Pageable pageable);

}