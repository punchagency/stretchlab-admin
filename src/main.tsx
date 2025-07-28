import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import {
  Home,
  Login,
  Signup,
  Verification,
  ForgotPassword,
  NoteTakingAdmin,
  Dashboard,
  ResetPassword,
  RobotAutomation,
  RobotSetup,
  Settings,
  Analytics,
  TwoFactorLogin,
  Notification,
  Billing,
  NotFound,
  ErrorPage,
} from "./pages";
import { Toaster } from "./components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "note-taking-app",
        element: <NoteTakingAdmin />,
      },
      {
        path: "robot-automation",
        element: <RobotAutomation />,
      },
      {
        path: "notification",
        element: <Notification />,
      },
      {
        path: "billing",
        element: <Billing />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/verification",
    element: <Verification />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/robot-setup",
    element: <RobotSetup />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/2fa-login",
    element: <TwoFactorLogin />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <NotFound />,
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
