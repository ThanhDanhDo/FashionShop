import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';

const CustomBreadcrumb = ({ items }) => {
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
    ...items,
  ];

  return (
    <div className="breadcrumb-responsive">
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};

export default CustomBreadcrumb;