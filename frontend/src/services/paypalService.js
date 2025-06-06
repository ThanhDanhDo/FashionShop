const API_BASE_URL = '/api/paypal'

export const createPaypalPaymentLink = async (amount) => {
    try {
        const res = await fetch(`${API_BASE_URL}/create-paypal-link`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ amount })
        });
        if (!res.ok) throw new Error('Lỗi tạo link paypal')
        return res.json();
    } catch (error) {
        console.error('Lỗi khi tạo link paypal:', error);
        throw error;
    }
}

export const handleSuccessPayment = async (paymentId, payerId, addressId, totalPrice) => {
    try {
        const res = await fetch(`${API_BASE_URL}/payment-success`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                paymentId,
                payerId,
                addressId,
                totalPrice,
            }),
        });
        
        return res.json()
    } catch (error) {
        console.error('Lỗi khi tạo đơn:', error);
        throw error;
    }
}