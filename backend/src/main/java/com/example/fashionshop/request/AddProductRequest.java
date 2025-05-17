package com.example.fashionshop.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddProductRequest {
    private Long productId;
    private String size;
    private int quantity;
    private String color;

}
