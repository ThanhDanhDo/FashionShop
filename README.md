# FashionShop

## Cấu trúc thư mục

```text
FashionShop/  
│── backend/                                    # Backend (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/fashionshop/   # Code Java backend
│   │   │   │   ├── controller/                 # Xử lý API request
│   │   │   │   ├── service/                    # Business logic
│   │   │   │   ├── repository/                 # Giao tiếp với MySQL
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
