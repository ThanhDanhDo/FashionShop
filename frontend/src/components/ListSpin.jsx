import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const FullPageSpin = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      minHeight: 300,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#fff',
      borderRadius: 8,
      boxSizing: 'border-box',
      flex: 1,
    }}
  >
    <Spin
      indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
      size="large"
      tip="Loading..."
    />
  </div>
);

export default FullPageSpin;