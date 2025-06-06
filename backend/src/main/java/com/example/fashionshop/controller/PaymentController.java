package com.example.fashionshop.controller;

import com.example.fashionshop.enums.PaymentOrderStatus;
import com.example.fashionshop.enums.PaymentStatus;
import com.example.fashionshop.model.*;
import com.example.fashionshop.repository.CartRepository;
import com.example.fashionshop.repository.OrderRepository;
import com.example.fashionshop.repository.PaymentOrderRepository;
import com.example.fashionshop.repository.UserRepository;
import com.example.fashionshop.request.PaymentPaypalRequest;
import com.example.fashionshop.response.ApiResponse;
import com.example.fashionshop.response.PaymentLinkResponse;
import com.example.fashionshop.service.*;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/paypal")
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
    private final OrderService orderService;

    @PostMapping("/create-paypal-link")
    public ResponseEntity<PaymentLinkResponse> createPaypalPaymentLink(
            Authentication authentication,
            @RequestBody Map<String, Object> requestBody
    ) throws Exception {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        double amount = Double.parseDouble(requestBody.get("amount").toString());

        String paypalLink = paymentService.createPaypalPayment(user, amount);
        PaymentLinkResponse res = new PaymentLinkResponse();
        res.setPayment_link_url(paypalLink);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }



    @PostMapping("/payment-success")
    public ResponseEntity<ApiResponse> paymentSuccessHandler (
            @RequestBody PaymentPaypalRequest request,
            Authentication authentication
    ) throws Exception {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }

        Optional<Order> order = orderRepository.findByPaymentString(request.getPaymentId());
        if (order.isPresent()) {
            ApiResponse apiResponse = new ApiResponse();
            apiResponse.setMessage("Payment already exists");
            apiResponse.setSuccess(true);

            return new ResponseEntity<>(apiResponse, HttpStatus.OK);
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        Cart cart = cartService.getCartByUserId(user.getId());
        if (cart == null || cart.getTotalItems() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, user.getId() + " Cart is empty");
        }

        Order newOrder = new Order();
        Payment payment = paypalService.excutePayment(request.getPaymentId(), request.getPayerId());
        if (payment.getState().equals("approved")){
            newOrder = orderService.addNewOrder(user, cart, request.getAddressId(), request.getTotalPrice());
            newOrder.setPaymentString(request.getPaymentId());
        }

        if (newOrder.getPaymentStatus().equals(PaymentStatus.COMPLETED)){
//            Report report = revenueService.getReport();
//            report.setTotalOrders(report.getTotalOrders() + 1);
//            report.setTotalRevenue(report.getTotalRevenue() + newOrder.getTotalOrderPrice());
//            revenueService.updateReport(report);

            cartService.clearCart(cart.getId());
        }

        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Payment success");
        apiResponse.setSuccess(true);

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
