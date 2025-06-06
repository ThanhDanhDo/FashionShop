package com.example.fashionshop.controller;

import com.example.fashionshop.enums.PaymentStatus;
import com.example.fashionshop.enums.OrderStatus;
import com.example.fashionshop.model.*;
import com.example.fashionshop.repository.AddressRepository;
import com.example.fashionshop.repository.CartRepository;
import com.example.fashionshop.repository.PaymentOrderRepository;
import com.example.fashionshop.repository.UserRepository;
import com.example.fashionshop.service.OrderService;
import com.example.fashionshop.response.PaymentLinkResponse;
import com.example.fashionshop.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;
    private final AddressRepository addressRepository;
    private final AddressService addressService;
    private final RevenueService revenueService;
    private final PaymentService paymentService;
    private final PaymentOrderRepository paymentOrderRepository;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<Order>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(orderService.findAllOrder(pageable));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Order>> getOrdersByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId, pageable));
    }

    @GetMapping("/status/{orderStatus}")
    public ResponseEntity<Page<Order>> getOrdersByStatus(
            @PathVariable OrderStatus orderStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Pageable pageable = PageRequest.of(page, size,
                sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending());

        Page<Order> orders = orderService.getOrdersByOrderStatus(orderStatus, pageable);
        return ResponseEntity.ok(orders);
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/my-orders")
    public ResponseEntity<Page<Order>> getOrdersOfCurrentUser(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Pageable pageable = PageRequest.of(page, size,
                sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending());
        return ResponseEntity.ok(orderService.getOrdersOfCurrentUser(authentication, pageable));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus orderStatus) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, orderStatus));
    }

    @PreAuthorize("hasAuthority('USER')")
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(Authentication authentication, @PathVariable Long orderId) {
        Order order = orderService.cancelOrder(authentication, orderId);
//        Report report = revenueService.getReport();
//        report.setCanceledOrders(report.getCanceledOrders() + 1);
//        report.setTotalRefunds(report.getTotalRefunds() + order.getTotalOrderPrice());
//        revenueService.updateReport(report);
        return ResponseEntity.ok(order);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/searchOrder")
    public ResponseEntity<?> searchOrder(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long addressId,
            @RequestParam(required = false) Long itemId,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(required = false) OrderStatus orderStatus,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Order> recPage = orderService.searchOrder(id, userId, addressId, itemId, fromDate, toDate, orderStatus, paymentStatus, pageable);

        List<Map<String, Object>> recList = recPage.getContent().stream().map(order -> {
            Map<String, Object> map = new HashMap<>();

            map.put("orderId", order.getId());
            map.put("date", order.getOrderDate().toLocalDate().toString());
            map.put("status", order.getOrderStatus().name());
            map.put("address", order.getAddress().getFullAddress());
            map.put("phone", order.getAddress().getPhone());
            map.put("paymentId", order.getPaymentString());
            map.put("total", order.getTotalOrderPrice());

            List<Map<String, Object>> products = order.getOrderItems().stream().map(item -> {
                Map<String, Object> productMap = new HashMap<>();
                Product p = item.getProduct();
                productMap.put("id", p.getId());
                productMap.put("name", p.getName());
                productMap.put("image", p.getImgurls() != null && !p.getImgurls().isEmpty() ? p.getImgurls().get(0) : null);
                productMap.put("quantity", item.getQuantity());
                productMap.put("price", p.getPrice());
                productMap.put("size", item.getSize());
                productMap.put("color", item.getColor());
                productMap.put("mainCategory", p.getMainCategory());
                productMap.put("subCategory", p.getSubCategory());
                productMap.put("gender", p.getGender());
                return productMap;
            }).toList();

            map.put("products", products);

            return map;
        }).toList();


        return ResponseEntity.ok(java.util.Map.of(
                "content", recList,
                "totalElements", recPage.getTotalElements(),
                "number", recPage.getNumber(),
                "size", recPage.getSize()
        ));
    }
}