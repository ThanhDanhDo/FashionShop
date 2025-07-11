import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { handleSuccessPayment } from '../../../services/paypalService'
import { Spin } from "antd";
import { FaCheckCircle } from "react-icons/fa";
import Navbar from "../../../components/Navbar/Navbar";
import { Link } from "react-router-dom";

const PayPalSuccess = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get("paymentId");
    const payerId = queryParams.get("PayerID");

    const totalPrice = localStorage.getItem("totalPriceToPay");
    const addressId = localStorage.getItem("shippingAddress");

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const hasRun = useRef(false);
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        const processPayment = async () => {
            const buyNowData = JSON.parse(localStorage.getItem("buyNowData"));
            try {
                let res;
                if (buyNowData) {
                    res = await handleSuccessPayment(
                        paymentId,
                        payerId,
                        addressId,
                        totalPrice,
                        buyNowData.product,
                        buyNowData.quantity,
                        buyNowData.color,
                        buyNowData.size
                    );
                } else {
                    res = await handleSuccessPayment(paymentId, payerId, addressId, totalPrice);
                }
                console.log("Kết quả thanh toán:", res);
                setSuccess(true);
                localStorage.removeItem("buyNowData");
            } catch (err) {
                console.error("Lỗi tạo đơn:", err);
                setError("Đã xảy ra lỗi khi xử lý thanh toán.");
            } finally {
                setLoading(false);
            }
        };

        processPayment();
    }, [paymentId, payerId, addressId, totalPrice]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "100px" }}>
                <Spin size="large" />
                <p>Processing payment...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: "center", color: "red", marginTop: "100px" }}>
                {error}
            </div>
        );
    }

    return (
        <div>
            <Navbar isLoggedIn={false} />
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "100px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        padding: "40px",
                        textAlign: "center",
                        maxWidth: "400px",
                        width: "100%",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    <FaCheckCircle
                        size={80}
                        style={{ color: "#2ecc71", marginBottom: "20px" }}
                    />
                    <h2
                        style={{
                            fontSize: "26px",
                            fontWeight: "bold",
                            marginBottom: "12px",
                            color: "#2ecc71",
                        }}
                    >
                        Payment successful!
                    </h2>
                    <p style={{ fontSize: "16px", color: "#555" }}>
                        Thank you for shopping with us.
                    </p>

                    <Link
                        to="/"
                        style={{
                            display: "inline-block",
                            marginTop: "24px",
                            padding: "12px 24px",
                            backgroundColor: "#2ecc71",
                            color: "#fff",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontWeight: "bold",
                            transition: "background-color 0.3s ease",
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = "#27ae60")}
                        onMouseOut={(e) => (e.target.style.backgroundColor = "#2ecc71")}
                    >
                        Return to home page
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default PayPalSuccess