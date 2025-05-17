-- Thay đổi kiểu dữ liệu của cột status
ALTER TABLE cart 
ALTER COLUMN status TYPE smallint USING status::smallint;

-- Thêm các cột mới nếu chưa có
ALTER TABLE cart 
ADD COLUMN IF NOT EXISTS total_cart_price double precision NOT NULL DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS total_items integer NOT NULL DEFAULT 0;
