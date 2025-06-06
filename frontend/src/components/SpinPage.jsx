import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const SpinPage = ({ spinning = false, percent = 0 }) => {
  if (!spinning) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(128,128,128,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
    >
      <Spin
        spinning={true}
        indicator={<LoadingOutlined style={{ fontSize: 48, color: '#fff' }} spin />}
        tip={<span style={{ color: '#fff', fontSize: 20 }}>Loading...</span>}
        size="large"
      />
    </div>
  );
};

export default SpinPage;