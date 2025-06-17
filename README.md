<!-- Banner -->
<p align="center">
  <a href="https://www.uit.edu.vn/" title="Trường Đại học Công nghệ Thông tin" style="border: none;">
    <img src="https://i.imgur.com/WmMnSRt.png" alt="Trường Đại học Công nghệ Thông tin | University of Information Technology">
  </a>
</p>

# FashionShop

## Giới Thiệu Tổng Quan

FashionShop là đồ án cuối kỳ môn Công nghệ Java - IE303.P21.CNCL của nhóm sinh viên của trường Đại học Công nghệ Thông tin - ĐHQG. Đồ án này được thực hiện bởi nhóm 6, lớp IE303.P21.CNCL dưới sự hướng dẫn của Th.S Huỳnh Văn Tín. Đây là một trang website quản lý và bán hàng sản phẩm thời trang.

## Thành Viên Nhóm

Các thành viên trong nhóm bao gồm:

| STT | Tên                  | Mã Số Sinh Viên | Vai Trò     |
| --- | -------------------- | --------------- | ----------- |
| 1   | Đỗ Thành Danh        | 22520198        | Trưởng nhóm |
| 2   | Phạm Hải Dương       | 22520309        | Thành Viên  |
| 3   | Đặng Đông Đức Dương  | 22520296        | Thành Viên  |
| 4   | Vũ Thanh Phong       | 22521095        | Thành Viên  |
| 5   | Ngô Phương Quyên     | 22521221        | Thành Viên  |

## Công nghệ sử dụng

 - Frontend: ReactJS, JavaScript, CSS
 - Backend: Java, SpringBoot
 - Database: Neon tech (PostgreSQL)
 - Công cụ khác: Postman, Neon tech (website), ...
 - Recommendation System: Python

## Chức năng chính

### User:
- Xem danh sách sản phẩm, tìm và xem chi tiết sản phẩm
- Xem sản phẩm tương tự
- Thêm sản phẩm vào giỏ
- Đặt hàng
- Sản phẩm yêu thích
- Quản lý địa chỉ (khi đặt hàng)
- Xem và huỷ đơn hàng
- Thanh toán với paypal
- Lấy sản phẩm gợi ý từ batch layer
- Lấy sản phẩm gợi ý từ stream layer

### Admin:
- Xem thống kê báo cáo (Dashboard)
- Quản lý user
- Quản lý sản phẩm
- Quản lý đơn hàng
- Kích hoạt huấn luyện batch layer

## Demo

## Document
[Nhom6_IE303.pdf](https://github.com/ThanhDanhDo/FashionShop/blob/main/docs/Nhom6_IE303.pdf)

## Cài Đặt

### Yêu Cầu Hệ Thống

-   Cài đặt JDK phiên bản 21
-   Python 

### Hướng Dẫn Cài Đặt

**Bước 1:** Clone repo về máy tính của bạn bằng cách sử dụng git command line hoặc download zip file.

```bash
git clone https://github.com/ThanhDanhDo/FashionShop.git
```

**Bước 2:** Di chuyển vào thư mục backend dự án.

```bash
cd backend
```
**Bước 3:** Cài đặt các dependencies.

```bash
mvn install
```

**Bước 4:** Cài đặt các thư viện, dependencies python
```bash
pip install --no-cache-dir pandas scikit-learn torchvision pillow requests numpy tqdm
```

**Bước 5:** Di chuyển vào thư mục frontend dự án.

```bash
cd frontend
```
**Bước 6:** Cài đặt các dependencies.

```bash
npm install
```
**Bước 7:** Khởi chạy server (cả bên backend và frontend)
- Bên backend:
```bash
cd backend
mvn spring-boot:run
```
- Bên frontend:
```bash
cd frontend
npm start
```

## Cấu trúc thư mục

```text
FashionShop/  
│── backend/                                    # Backend (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/fashionshop/   # Code Java backend
│   │   │   │   ├── recommendation/             # Liên quan đến Recommendation System (Contentbase, ...)
│   │   │   │   ├── controller/                 # Xử lý API request
│   │   │   │   ├── enums/                      # Kiểu enum dùng cho kiểu dữ liệu trong model
│   │   │   │   ├── exception/                  # Chứa các file xử lý exception
│   │   │   │   ├── service/                    # Business logic
│   │   │   │   ├── repository/                 # Giao tiếp với MySQL
│   │   │   │   ├── request/                    # Xác định kiểu request cho các request trong controller
│   │   │   │   ├── response/                   # Xác định kiểu response cho các response trong controller
│   │   │   │   ├── model/                      # Định nghĩa các entity
│   │   │   │   ├── config/                     # Cấu hình ứng dụng
│   │   │   ├── resources/                      # File cấu hình
│   │   │   │   ├── application.properties
│   │   │   ├── FashionShopApplication.java     # File chạy chính
│   ├── pom.xml                                 # Quản lý dependency Maven
│── frontend/                                   # Frontend (React)
│   ├── src/
│   │   ├── components/                         # Các component UI
│   │   ├── pages/                              # Các trang (Home, Product, Cart,...)
│   │   ├── context/                            # Quản lý Context API
│   │   ├── services/                           # Giao tiếp với API backend
│   │   ├── App.js                              # File component chính
│   │   ├── index.js                            # File khởi tạo ứng dụng (entry point)
│   ├── public/
│   ├── package.json                            # Quản lý dependencies React
│── database/                                   # Cấu trúc CSDL
│   ├── schema.sql                              # File tạo bảng MySQL
│   ├── seed.sql                                # Dữ liệu mẫu ban đầu
│── docs/                                       # Tài liệu về dự án
│── README.md                     
│── .gitignore                     
```

## Screenshot
### Home
<img src="https://github.com/user-attachments/assets/250d8430-e0b7-41cd-bccc-381142470d9a" width="300">

### Recommended Prodcut:
Gợi ý sản phẩm dựa vào (Collaborative Filtering):
- Lượt tương tác (click vào sản phẩm), giới tính của người dùng
- Sản phẩm cùng thể loại tương tự
<img src="https://github.com/user-attachments/assets/6fb6ccdb-97ef-4f99-9736-23a7cca6f4c5" width="300">
<img src="https://github.com/user-attachments/assets/5fb597fe-8f52-4021-82a0-46056e76f2b9" width="300">

### Xem danh sách sản phẩm, tìm và xem chi tiết sản phẩm
- Lọc sản phẩm theo Main Category và Sub Category
<img src="https://github.com/user-attachments/assets/028e3fe5-c032-46c2-9e1e-0fecc3cd46fc" width="300">
<img src="https://github.com/user-attachments/assets/6a10972e-3b2c-4652-9fe4-39bdbff7791a" width="300">

### Giỏ hàng
- Thêm/ Xóa/ Sửa sản phẩm trong giỏ hàng
<img src="https://github.com/user-attachments/assets/3c236620-82fc-4186-8b82-817fa11704e8" width="300">

### Thanh toán bằng Paypal
<img src="https://github.com/user-attachments/assets/1456c130-642f-414c-935c-6a862b65029a8" width="300">
<img src="https://github.com/user-attachments/assets/7dc6270a-4767-4aab-b70b-50e3474178f4" width="300">

### Đơn hàng
- Xem/ Hủy/ Thay đổi trạng thái đơn hàng
<img src="https://github.com/user-attachments/assets/d2b5977c-ec78-4597-afe9-5ee91a974c65" width="300">

### Yêu thích
<img src="https://github.com/user-attachments/assets/4b1ef824-e303-4c05-845a-81c7084d31c3" width="300">

### Dashboard
- Xem được doanh thu hằng ngày/ tháng.
- Tổng số lượng người dùng, sản phẩm, đơn hàng, ...
<img src="https://github.com/user-attachments/assets/5ed58e19-06d3-47c3-b83e-23ff0dcea11b3" width="300">
<img src="https://github.com/user-attachments/assets/8a5a8680-00f4-486b-8afe-4e2c22cb84dc" width="300">

### Quản lý Sản Phẩm
- Thêm và sửa sản phẩm
- Tìm kiếm
<img src="https://github.com/user-attachments/assets/e6b5ff20-24af-4bf5-93b7-fdf2be74fc2d" width="300">

### Quản lý Đơn hàng
- Xem và thay đổi trạng thái đơn hàng
- Tìm kiếm
<img src="https://github.com/user-attachments/assets/8cfd0c1a-94e7-482d-a3b4-4fcfc408fd6a" width="300">

### Quản lý tài khoản người dùng
- Xem, sửa thông tin tài khoản người dùng
- Tìm kiếm
<img src="https://github.com/user-attachments/assets/b653f7f8-e892-4141-a5d1-2b161b764b3d" width="300">

### Quản lý hệ thống khuyến nghị
- Kích hoạt huấn luyện batch layer
<img src="https://github.com/user-attachments/assets/87593d05-5954-4e04-bb73-9f5776d9ecec" width="300">
<img src="https://github.com/user-attachments/assets/9d40e31a-7e68-4b59-a253-c9f7b0821880" width="300">
