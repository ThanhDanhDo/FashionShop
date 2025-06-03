import React from 'react';
import { Spin } from 'antd';

/**
 * Loader toàn trang, đè lên mọi nội dung khi spinning=true
 * Sử dụng: <SpinPage spinning={loading} />
 */
const SpinPage = ({ spinning = false, percent = 0 }) => (
  <Spin
    spinning={spinning}
    percent={percent}
    fullscreen
    tip="Loading..."
    style={{ zIndex: 2000 }}
  />
);

export default SpinPage;