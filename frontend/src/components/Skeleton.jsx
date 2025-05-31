import React from 'react';
import { Skeleton } from 'antd';

const InfoSkeleton = () => (
  <div>
    <div style={{ marginBottom: 16 }}>
      <Skeleton.Input style={{ width: '100%', height: 40, borderRadius: 8 }} active />
    </div>
    <div style={{ marginBottom: 16 }}>
      <Skeleton.Input style={{ width: '100%', height: 40, borderRadius: 8 }} active />
    </div>
    <div style={{ marginBottom: 16 }}>
      <Skeleton.Input style={{ width: '100%', height: 40, borderRadius: 8 }} active />
    </div>
    <div style={{ marginBottom: 16 }}>
      <Skeleton.Input style={{ width: '100%', height: 40, borderRadius: 8 }} active />
    </div>
  </div>
);

export default InfoSkeleton;