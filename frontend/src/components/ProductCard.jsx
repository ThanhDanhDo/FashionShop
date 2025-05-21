import React from 'react';

const ProductCard = ({ product, isFavorite, onToggleFavorite, index }) => {
  return (
    <div
      style={{
        minWidth: "200px", // Thêm minWidth để tránh thẻ bị nén
        border: "1px solid #eee",
        borderRadius: "10px",
        padding: "10px",
        textAlign: "left",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: "1/1",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "8px",
            transition: "transform 0.3s ease",
          }}
        />
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(index);
          }}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "28px",
            height: "28px",
            background: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 2,
            cursor: "pointer",
            color: isFavorite ? "red" : "gray",
            transition: "color 0.3s ease",
          }}
        >
          {isFavorite ? "❤️" : "🤍"}
        </div>
      </div>
      <h3 style={{ fontSize: "18px", margin: "10px 0" }}>{product.name}</h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            color: "#666",
            marginBottom: "0",
            marginRight: "10px",
          }}
        >
          Size: {product.sizes}
        </p>
        <div style={{ display: "flex", gap: "6px" }}>
          {product.colors?.map((color, cidx) => (
            <div
              key={cidx}
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: color,
                border: "1px solid #ccc",
              }}
            />
          ))}
        </div>
      </div>
      <p style={{ marginBottom: "4px" }}>{product.price.toLocaleString()} VND</p>
      <p style={{ fontSize: "16px" }}>
        ★ {product.rating} ({product.reviewCount})
      </p>
    </div>
  );
};

export default ProductCard;