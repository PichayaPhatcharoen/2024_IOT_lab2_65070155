import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SWRConfig } from "swr";
import axios from "axios";
import HomePage from "./pages";
import { Notifications } from "@mantine/notifications";
import BooksPage from "./pages/books";
import BookByIdPage from "./pages/book-by-id";
import BookEditById from "./pages/book-edit-by-id";
import MenusPage from "./pages/menus"
import { ModalsProvider } from "@mantine/modals";
import BookCreatePage from "./pages/book-create";
import MenuEditPagebyid from "./pages/menu-edit-by-id";
import MenuEditPage from "./pages/menus-editpage";
import MenuCreatePage from "./pages/menu-create";
import MenuOrdering from "./pages/menus-odering";
import CusOrder from "./pages/customer_order";

const theme = createTheme({
  primaryColor: "orange",
  fontFamily: '"Noto Sans Thai Looped", sans-serif',
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/books",
    element: <BooksPage />,
  },
  {
    path: "/books/create",
    element: <BookCreatePage />,
  },
  {
    path: "/books/:bookId",
    element: <BookByIdPage />,
  },
  {
    path: "/books/:bookId/edit",
    element: <BookEditById />,
  },
  {
    path: "/menus/",
    element: <MenusPage />,
  },{
    path: "/menus/edit/:menuId",
    element: <MenuEditPagebyid />,
  },{
    path: "/menus/edit/",
    element: <MenuEditPage />,
  },
  {
    path: "/menus/create",
    element: <MenuCreatePage />,
  },
  {
    path: "/menu/ordering/:menuId",
    element: <MenuOrdering />, 
  },
  {
    path: "/menus/cus_orders/",
    element: <CusOrder />, 
  },
]);

if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          axios
            .get(url, {
              baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1",
            })
            .then((res) => res.data),
      }}
    >
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <ModalsProvider>
          <RouterProvider router={router} />
        </ModalsProvider>
      </MantineProvider>
    </SWRConfig>
  </React.StrictMode>
);
