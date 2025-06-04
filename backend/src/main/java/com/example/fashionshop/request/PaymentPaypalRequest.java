package com.example.fashionshop.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentPaypalRequest {
    private String paymentId;
    private String payerId;
    private Long addressId;
    private Double totalPrice;
}
