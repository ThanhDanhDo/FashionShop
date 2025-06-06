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

export const updateOrderStatus = async (orderId, status) => {
    try {
        const res = await fetch(`/api/orders/${orderId}/status?orderStatus=${status}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("Lỗi cập nhật trạng thái đơn hàng: ", error);
    }
};

export const searchOrder = async ({
    id,
    userId,
    addressId, 
    itemId, 
    fromDateStr, 
    toDateStr, 
    orderStatus, 
    paymentStatus,
    page = 0,
    size = 10,
    sortBy = 'id',
    sortDir = 'asc',
  }) => {
    const params = new URLSearchParams({ page, size, sortBy, sortDir });
  
    if (id !== undefined && id !== null) params.append('id', id);
    if (userId !== undefined && userId !== null) params.append('userId', userId);
    if (addressId !== undefined && addressId !== null) params.append('addressId', addressId);
    if (itemId !== undefined && itemId !== null) params.append('itemId', itemId);
    if (fromDateStr !== undefined && fromDateStr !== null) params.append('fromDate', fromDateStr);
    if (toDateStr !== undefined && toDateStr !== null) params.append('toDate', toDateStr);
    if (orderStatus !== undefined && orderStatus !== null) params.append('orderStatus', orderStatus);
    if (paymentStatus !== undefined && paymentStatus !== null) params.append('paymentStatus', paymentStatus);
  
    const url = `/api/orders/searchOrder?${params.toString()}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Không thể tìm kiếm đơn hàng!');
      }
  
      return response.json();
    } catch (error) {
      console.error(error);
      throw new Error('Có lỗi xảy ra trong khi tìm kiếm đơn hàng!');
    }
  };


  

