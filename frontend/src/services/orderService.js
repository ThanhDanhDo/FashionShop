const API_BASE_URL = "/api/orders";

export const getMyOrders = async (page = 0, size = 100) => {
    try {
        const res = await fetch(
            `${API_BASE_URL}/my-orders?page=${page}&size=${size}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );
        if (!res.ok) throw new Error("Không thể lấy danh sách đơn hàng");
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("getMyOrders lỗi: ", error)
    }
}

export const cancelOrder = async (orderId) => {
    try {
        const res =  await fetch(`${API_BASE_URL}/${orderId}/cancel`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("Lỗi huỷ đơn: ", error)
    }
}