import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';

const CustomBreadcrumb = ({ items }) => {
  // Thêm trang chủ làm mục đầu tiên mặc định
  const breadcrumbItems = [
    {
      href: '/',
      title: (
        <>
          <HomeOutlined />
          <span>Home</span>
        </>
      ),
    },
    ...items, // Thêm các mục truyền từ props
  ];

  return (
    <div style={{ padding: '10px 48px' }}> {/* Thêm padding trái */}
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};

export default CustomBreadcrumb;