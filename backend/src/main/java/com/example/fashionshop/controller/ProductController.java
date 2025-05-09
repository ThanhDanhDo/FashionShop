package com.example.fashionshop.controller;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.Category;
import com.example.fashionshop.service.ProductService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Optional;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // @GetMapping("/search")
    // public ResponseEntity<List<Product>> getProductByName(@RequestParam String
    // Name) {
    // List<Product> product = productService.getProductByName(Name);

    // if (product != null)
    // return ResponseEntity.ok(product);
    // else
    // return ResponseEntity.notFound().build();
    // }

    @GetMapping("/all")
    public ResponseEntity<Page<Product>> getAllProduct(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.getAllProduct(pageable);

        if (products != null)
            return ResponseEntity.ok(products);
        else
            return ResponseEntity.notFound().build();
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Product>> filterProducts(
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) Long mainCategoryId,
            @RequestParam(required = false) Long subCategoryId,
            @RequestParam(required = false) List<String> sizes,
            @RequestParam(required = false) List<String> colors,
            @RequestParam(required = false) List<String> priceRanges,
            @PageableDefault(page = 0, size = 80) Pageable pageable) {
        System.out.println(
                "API request: GET /api/products/filter?gender=" + gender + "&mainCategoryId=" + mainCategoryId +
                        "&subCategoryId=" + subCategoryId + "&sizes=" + sizes + "&colors=" + colors + "&priceRanges="
                        + priceRanges);
        Page<Product> products = productService.filterProducts(gender, mainCategoryId, subCategoryId, sizes, colors,
                priceRanges, pageable);
        return ResponseEntity.ok(products);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            Product savedProduct = productService.addProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving products: " + e);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<?> updateProduct(@RequestBody Product product) {
        try {
            Product updatedProduct = productService.updateProduct(product);
            return ResponseEntity.status(HttpStatus.OK).body(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No product found");
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Product deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No product found");
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/add_bulk")
    public ResponseEntity<?> addProducts(@RequestBody List<Product> products) {
        try {
            List<Product> response = productService.addProducts(products);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving products");
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/update_bulk")
    public ResponseEntity<?> updateProducts(@RequestBody List<Product> products) {
        try {
            Map<String, List<Product>> response = productService.updateProducts(products);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating products");
        }
    }
}
