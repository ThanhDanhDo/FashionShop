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

## Cài Đặt

### Yêu Cầu Hệ Thống

-   Cài đặt JDK phiên bản 21

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

**Bước 4:** Di chuyển vào thư mục frontend dự án.

```bash
cd frontend
```
**Bước 5:** Cài đặt các dependencies.

```bash
npm install
```
**Bước 6:** Khởi chạy server (cả bên backend và frontend)
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
