import React from 'react';
import { notification } from 'antd';

const NotificationContext = React.createContext();

export const useNotification = () => React.useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;