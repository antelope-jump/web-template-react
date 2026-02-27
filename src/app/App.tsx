import { ConfigProvider, theme } from 'antd';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/router';

export function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 10,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}
