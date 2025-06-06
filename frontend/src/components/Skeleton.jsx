import React from 'react';
import { Skeleton } from 'antd';

const InfoSkeleton = ({ rows = 8 }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      minHeight: 300,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#fff',
      borderRadius: 8,
      boxSizing: 'border-box',
    }}
  >
    <Skeleton
      active
      paragraph={{ rows, width: '100%' }}
      title={false}
      style={{ width: '100%' }}
    />
  </div>
);

export default InfoSkeleton;