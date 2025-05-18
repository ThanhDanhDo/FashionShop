package com.example.fashionshop.controller;

import com.example.fashionshop.enums.PaymentOrderStatus;
import com.example.fashionshop.enums.PaymentStatus;
import com.example.fashionshop.model.*;
import com.example.fashionshop.repository.CartRepository;
import com.example.fashionshop.repository.OrderRepository;
import com.example.fashionshop.repository.PaymentOrderRepository;
import com.example.fashionshop.repository.UserRepository;
import com.example.fashionshop.response.ApiResponse;
import com.example.fashionshop.service.CartService;
import com.example.fashionshop.service.PaymentService;
import com.example.fashionshop.service.PaypalService;
import com.example.fashionshop.service.RevenueService;
import com.paypal.api.payments.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
public class PaymentController {
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final PaypalService paypalService;
    private final OrderRepository orderRepository;
    private final PaymentOrderRepository paymentOrderRepository;
    private final RevenueService revenueService;
    private final CartRepository cartRepository;
    private final CartService cartService;

    @GetMapping("/payment-success/{orderId}")
    public ResponseEntity<ApiResponse> paymentSuccessHandler (
            @PathVariable Long orderId,
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId,
            Authentication authentication
    ) throws Exception {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        PaymentOrder paymentOrder = paymentService.getPaymentOrderByOrderId(orderId);
        Order order = paymentOrder.getOrder();
        if (paymentOrder.getStatus().equals(PaymentOrderStatus.PENDING)){
            Payment payment = paypalService.excutePayment(paymentId, payerId);
            if (payment.getState().equals("approved")){
                order.setPaymentStatus(PaymentStatus.COMPLETED);
                orderRepository.save(order);

                paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                paymentOrderRepository.save(paymentOrder);
            }
            else {
                paymentOrder.setStatus(PaymentOrderStatus.FAILED);
                paymentOrderRepository.save(paymentOrder);
            }
        }

        if (paymentOrder.getStatus().equals(PaymentOrderStatus.SUCCESS)){
            Report report = revenueService.getReport();
            report.setTotalOrders(report.getTotalOrders() + 1);
            report.setTotalRevenue(report.getTotalRevenue() + order.getTotalOrderPrice());
            revenueService.updateReport(report);

            Cart cart = cartRepository.findByUserId(user.getId());
            cartService.clearCart(cart.getId());
        }
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Payment success");
        apiResponse.setSuccess(true);

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
