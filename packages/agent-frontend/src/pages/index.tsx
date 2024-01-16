import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "../view/App";
import Auth from "../view/Auth";
import { ConfigProvider, Layout, theme } from "antd";
import { Content } from "antd/es/layout/layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);

export default function Pages() {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Layout>
        <Content>
          <RouterProvider router={router} />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
