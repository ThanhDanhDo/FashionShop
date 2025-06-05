const API_BASE_URL = '/api/wishlist';

export const getWishlist = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        if (!res.ok) {
            console.error('Lỗi khi lấy wishlist');
        }
        return res.json();
    } catch (error) {
        console.error('Lỗi khi lấy wishlist: ', error);
        throw error;
    }
}

export const toggleWishlistItem = async (productId) => {
    try {
        const res = await fetch(`${API_BASE_URL}/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        return res.json();
    } catch (error) {
        console.error('Lỗi khi sửa wishlist: ', error);
        throw error;
    }
}