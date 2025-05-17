package com.example.fashionshop.controller;

import com.example.fashionshop.enums.OrderStatus;
import com.example.fashionshop.model.Address;
import com.example.fashionshop.model.Cart;
import com.example.fashionshop.model.Order;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.AddressRepository;
import com.example.fashionshop.repository.CartRepository;
import com.example.fashionshop.repository.UserRepository;
import com.example.fashionshop.service.AddressService;
import com.example.fashionshop.service.CartService;
import com.example.fashionshop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/create")
    public Order createOrder(Authentication authentication, @RequestBody Address addr) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        Cart cart = cartService.getCartByUserId(user.getId());
        if (cart == null || cart.getTotalItems() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, user.getId() + " Cart is empty");
        }
        // Lấy địa chỉ giao hàng từ request
        Address address = addressService.getAddressById(addr.getId());
        if (address == null || !user.getAddresses().contains(address)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid shipping address");
        }
        return orderService.createOrder(user, cart, address);
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
    public ResponseEntity<Order> cancelOrder(
            Authentication authentication,
            @PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.cancelOrder(authentication, orderId));
    }
}