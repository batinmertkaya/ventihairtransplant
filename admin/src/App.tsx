// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Login } from "./auth";
import { PrivateRoute } from "./PrivateRoute";
import { BlogTable } from "./dashboard/blog/BlogTable";
import { BlogCreate } from "./dashboard/blog/BlogCreate";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={null}>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/" element={<BlogTable />} />
        <Route path="/blog/create" element={<BlogCreate />} />
        <Route path="/blog/:id" element={<BlogCreate />} />
      </Route>
    </Route>
  )
);

const queryClient = new QueryClient();

export default function App() {
  return (
    <MantineProvider>
      <Notifications position="top-right" />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  );
}
