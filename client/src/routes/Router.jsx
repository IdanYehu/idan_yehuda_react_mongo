
import { createBrowserRouter } from "react-router-dom";
import { PublicRoute,ProtectedRoute } from "./RouteGuards";
import AppLayout from "../AppLayout";
import HomePage from "@pages/HomePage";
import MyToolsPage from "@pages/MyToolsPage";
import ToolsForLoanPage from "@pages/ToolsForLoanPage";
import UserProfile from "@pages/UserProfile";
import PendingRequestsPage from "@pages/PendingRequestsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout/>,
    children: [
      {
        path: "/",
        element:
          <PublicRoute>
            <HomePage />
          </PublicRoute>,
      },
      {
        path: "/my-tools",
        element: (
          <ProtectedRoute>
            <MyToolsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tools-for-loan",
        element: (
          <ProtectedRoute>
            <ToolsForLoanPage />
          </ProtectedRoute>
        ),      
      },
      {
        path: "/pending-requests",
        element: (
          <ProtectedRoute>
            <PendingRequestsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      }
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

export default router;
