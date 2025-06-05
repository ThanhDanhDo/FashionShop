package com.example.fashionshop.service;

import com.example.fashionshop.enums.OrderStatus;
import com.example.fashionshop.enums.PaymentStatus;
import com.example.fashionshop.model.*;
import com.example.fashionshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final AddressService addressService;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final ProductRepository productRepository;

    @Transactional //tạo đơn hàng từ các sản phẩm trong giỏ hàng
    public Order addNewOrder(User user, Cart cart, Long addressId, Double totalPrice) {
        if (user == null || cart == null || cart.getCartItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty or invalid user.");
        }

        // Kiểm tra số lượng tồn kho trước khi tạo đơn hàng
        for (CartItem cartItem : cart.getCartItems()) {
            if (cartItem.getQuantity() > cartItem.getProduct().getStock()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Product " + cartItem.getProduct().getName() + " is out of stock.");
            }
        }

        String email = user.getEmail();
        if (email == null) {
            throw new IllegalArgumentException("Email not found.");
        }
        Address shippingAddress = addressRepository.findById(addressId)
                .filter(address -> user.getAddresses().contains(address))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid shipping address."));

        List<CartItem> cartItems = cart.getCartItems();
        int totalItems = cartItems.stream().mapToInt(cartItem -> cartItem.getQuantity()).sum();

        Order newOrder = new Order();
        newOrder.setUser(user);
        newOrder.setAddress(shippingAddress);
        newOrder.setTotalOrderPrice(totalPrice);
        newOrder.setTotalItems(totalItems);
        newOrder.setOrderStatus(OrderStatus.PENDING);
        newOrder.setPaymentStatus(PaymentStatus.COMPLETED);

        Order savedOrder = orderRepository.save(newOrder);

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem(
                    savedOrder,
                    cartItem.getProduct(),
                    cartItem.getQuantity(),
                    cartItem.getSize(),
                    cartItem.getColor()
            );
            OrderItem savedOrderItem = orderItemRepository.save(orderItem);
            orderItems.add(savedOrderItem);
        }
        savedOrder.setOrderItems(orderItems);
        orderRepository.save(savedOrder);

        return savedOrder;
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus orderStatus) {
        if (orderStatus == OrderStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot cancel a order of customer");
        }

        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        }
        Order order = optionalOrder.get();
        // Trừ kho khi đơn hàng từ pending -> confirmed
        if ((order.getOrderStatus() == OrderStatus.PENDING && orderStatus == OrderStatus.CONFIRMED) ||
                (order.getOrderStatus() == OrderStatus.PENDING && orderStatus == OrderStatus.SHIPPED) ||
                (order.getOrderStatus() == OrderStatus.PENDING && orderStatus == OrderStatus.DELIVERED)) {

            for (OrderItem orderItem : order.getOrderItems()) {
                Product product = orderItem.getProduct();
                product.setStock(product.getStock() - orderItem.getQuantity());
                productRepository.save(product);
            }
        }
        order.setOrderStatus(orderStatus);
        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Authentication authentication, Long orderId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        // Không cho phép huỷ nếu đơn đã giao
        if (order.getOrderStatus() == OrderStatus.SHIPPED || order.getOrderStatus() == OrderStatus.DELIVERED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot cancel a shipped or delivered order.");
        }
        // Hoàn lại hàng vào kho khi huỷ đơn nếu đơn hàng đã xác nhận
        if (order.getOrderStatus() == OrderStatus.CONFIRMED) {
            for (OrderItem orderItem : order.getOrderItems()) {
                Product product = orderItem.getProduct();
                product.setStock(product.getStock() + orderItem.getQuantity());
                productRepository.save(product);
            }
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    public Order getOrderById(Long orderId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) {
            throw new IllegalArgumentException("Order not found.");
        }
        return optionalOrder.get();
    }

    public Page<Order> findAllOrder(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public Page<Order> getOrdersByUserId(Long userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable);
    }

    public Page<Order> getOrdersByOrderStatus(OrderStatus orderStatus, Pageable pageable) {
        return orderRepository.findByOrderStatus(orderStatus, pageable);
    }

    public Page<Order> getOrdersOfCurrentUser(Authentication authentication, Pageable pageable) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        return orderRepository.findByUserId(user.getId(), pageable);
    }

}
