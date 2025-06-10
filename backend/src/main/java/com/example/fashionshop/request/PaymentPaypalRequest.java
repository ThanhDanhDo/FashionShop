package com.example.fashionshop.request;

import com.example.fashionshop.model.Product;
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
    private double totalPrice;
    private Long product;
    private int quantity;
    private String color;
    private String size;
}
