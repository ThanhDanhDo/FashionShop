package com.example.fashionshop.controller;

import com.example.fashionshop.model.Interact;
import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.Recommendation;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.ProductRepository;
import com.example.fashionshop.repository.UserRepository;
import com.example.fashionshop.service.InteractService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rec")
@RequiredArgsConstructor
public class InteractController {
    private final InteractService interactService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @PostMapping("/add_interact")
    public ResponseEntity<?> addInteract(@RequestBody Map<String, Object> payload, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            // Bỏ qua, trả về thành công nhưng không thêm tương tác
            return ResponseEntity.ok().body("Không có user đăng nhập, bỏ qua thao tác tương tác");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        Long productId = Long.valueOf(payload.get("productId").toString());
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Not found"));

        Interact interact = interactService.addInteract(user, product);
        return ResponseEntity.ok(interact);
    }

    @GetMapping("")
    public ResponseEntity<List<Product>> getInteractToRecommendation(Authentication authentication) throws Exception {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        List<Product> recommend = interactService.getInteractToRecommendation(user);

        return ResponseEntity.ok(recommend);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<List<Product>> getContentBasedRecommendation(@PathVariable Long productId) throws Exception {
        List<Product> recommend = interactService.getContentBasedRecommendation(productId);
        return ResponseEntity.ok(recommend);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/searchInteract")
    public ResponseEntity<?> searchInteract(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Interact> recPage = interactService.searchInteract(id, userId, productId, pageable);

        List<Map<String, Object>> recList = recPage.getContent().stream().map(interact -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", interact.getId());
            map.put("userId", interact.getUserId());
            map.put("product", interact.getProduct().getId());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "content", recList,
                "totalElements", recPage.getTotalElements(),
                "number", recPage.getNumber(),
                "size", recPage.getSize()
        ));
    }
}