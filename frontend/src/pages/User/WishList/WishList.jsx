import React from "react";
import Navbar from '../../../components/Navbar/Navbar';
import "./WishList.css";
import FavoriteIcon from '@mui/icons-material/Favorite';

const wishListItems = [
  {
    id: 1,
    name: "Áo sơ mi trắng",
    image: "/images/image3.png",
    price: 350000,
    size: "M",
    color: "Trắng",
    material: "Cotton 100%",
  },
  {
    id: 2,
    name: "Chân váy caro",
    image: "/images/image4.png",
    price: 420000,
    size: "S",
    color: "Đỏ caro",
    material: "Vải dạ mềm",
  },
  {
    id: 3,
    name: "Áo khoác denim",
    image: "/images/image1.png",
    price: 590000,
    size: "L",
    color: "Xanh jean",
    material: "Denim dày",
  },
  {
    id: 4,
    name: "Áo thun",
    image: "/images/image2.png",
    price: 480000,
    size: "M",
    color: "Hoa pastel",
    material: "Voan mỏng",
  },
];

const WishList = () => {
  return (
    <div>
      <Navbar />
      <div className="wishlist-container">
        <h1 className="wishlist-title">WISHLIST</h1>
        {wishListItems.length === 0 ? (
          <p className="wishlist-empty">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.</p>
        ) : (
          <div className="wishlist-items">
            {wishListItems.map((item) => (
              <div key={item.id} className="wishlist-card">
                <div className="wishlist-image-wrapper small">
                  <img src={item.image} alt={item.name} className="wishlist-image" />
                </div>
                <div className="wishlist-info">
                  <div className="wishlist-header">
                    <h2 className="wishlist-name">{item.name}</h2>
                  </div>

                  <p className="wishlist-price">{item.price.toLocaleString()} VND</p>
                  
                  <p className="wishlist-details">
                    Size: <strong>{item.size}</strong> | Màu: <strong>{item.color}</strong>
                  </p>
                  
                  <p className="wishlist-extra">
                    Chất liệu: <strong>{item.material}</strong>
                  </p>

                  <div className="wishlist-actions">
                    <button className="add-to-cart">Thêm vào giỏ</button>
                    <button className="remove-wishlist">Xóa</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;
