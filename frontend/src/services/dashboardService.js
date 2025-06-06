const API_BASE_URL = '/api/admin/dashboard'

export const getRevenueChart = async (type = 'daily') => {
    try {
        const res = await fetch(`${API_BASE_URL}/revenue/chart?type=${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!res.ok) {
            throw new Error(`Lỗi HTTP: ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("Không thể lấy dữ liệu doanh thu: ", error)
    }
}

export const getReport = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/report`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error(`Lỗi HTTP: ${res.status}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Không thể lấy báo cáo: ", error);
        return null;
    }
}