package com.example.fashionshop.enums;

public enum CartStatus {
    ACTIVE(0),    // Giỏ hàng đang hoạt động
    ORDERED(1),   // Đã đặt hàng
    COMPLETED(2), // Hoàn thành
    CANCELED(3);  // Đã hủy

    private final int value;

    CartStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static CartStatus fromValue(int value) {
        for (CartStatus status : CartStatus.values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid CartStatus value: " + value);
    }
}
