package com.example.fashionshop.service;

import com.example.fashionshop.model.OrderItem;
import com.example.fashionshop.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderItemService {
    private final OrderItemRepository orderItemRepository;

    public OrderItem getOrderItemById(Long orderItemId) {
        return orderItemRepository.findById(orderItemId).orElse(null);
    }

    public List<OrderItem> findAllByOrderId(Long orderId) {
        return orderItemRepository.findAllByOrderId(orderId);
    }
}
