package com.example.fashionshop.service;

import com.example.fashionshop.enums.PaymentOrderStatus;
import com.example.fashionshop.model.Order;
import com.example.fashionshop.model.PaymentOrder;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.OrderRepository;
import com.example.fashionshop.repository.PaymentOrderRepository;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentOrderRepository paymentOrderRepository;
    private final OrderRepository orderRepository;
    private final PaypalService paypalService;

    public String createPaypalPayment(User user, double amount) throws PayPalRESTException {
        double totalPriceVnd = amount;
        String currency = "USD"; // PayPal dùng USD
        String method = "paypal";
        String intent = "sale";
        String description = "Payment for order of " + user.getEmail();
        String cancelUrl = "http://localhost:3000/cart"; //link về frontend báo thanh toán bị cancel
        String successUrl = "http://localhost:3000/payment-success/";

        Payment payment = paypalService.createPayment(
                totalPriceVnd, currency, method, intent, description, cancelUrl, successUrl
        );

        for (Links link : payment.getLinks()) {
            if (link.getRel().equalsIgnoreCase("approval_url")) {
                return link.getHref(); // đây là link để redirect user đến PayPal
            }
        }
        throw new PayPalRESTException("payment link not found");
    }

}
