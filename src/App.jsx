import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Loader from "./components/Loader";
import { PrivateRoute, RoleRoute } from "./components/RouteGuards";

const Home = lazy(() => import("./pages/public/Home"));
const BrowseStartups = lazy(() => import("./pages/public/BrowseStartups"));
const BrowseOpportunities = lazy(() => import("./pages/public/BrowseOpportunities"));
const StartupDetails = lazy(() => import("./pages/public/StartupDetails"));
const OpportunityDetails = lazy(() => import("./pages/public/OpportunityDetails"));
const NotFound = lazy(() => import("./pages/public/NotFound"));
const PaymentSuccess = lazy(() => import("./pages/public/PaymentSuccess"));
const PaymentCancelled = lazy(() => import("./pages/public/PaymentCancelled"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const AuthCallback = lazy(() => import("./pages/auth/AuthCallback"));
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const MyStartup = lazy(() => import("./pages/dashboard/MyStartup"));
const AddOpportunity = lazy(() => import("./pages/dashboard/AddOpportunity"));
const ManageOpportunities = lazy(() => import("./pages/dashboard/ManageOpportunities"));
const FounderApplications = lazy(() => import("./pages/dashboard/FounderApplications"));
const MyApplications = lazy(() => import("./pages/dashboard/MyApplications"));
const AdminUsers = lazy(() => import("./pages/dashboard/AdminUsers"));
const AdminStartups = lazy(() => import("./pages/dashboard/AdminStartups"));
const Transactions = lazy(() => import("./pages/dashboard/Transactions"));

export default function App() {
  return (
    <Suspense fallback={<Loader fullScreen label="Loading StartupForge..." />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="startups" element={<BrowseStartups />} />
          <Route path="startups/:id" element={<StartupDetails />} />
          <Route path="opportunities" element={<BrowseOpportunities />} />
          <Route path="opportunities/:id" element={<OpportunityDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="auth/callback" element={<AuthCallback />} />
          <Route element={<PrivateRoute />}>
            <Route path="payment/success" element={<PaymentSuccess />} />
            <Route path="payment/cancelled" element={<PaymentCancelled />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route element={<RoleRoute roles={["founder"]} />}>
              <Route path="my-startup" element={<MyStartup />} />
              <Route path="add-opportunity" element={<AddOpportunity />} />
              <Route path="opportunities" element={<ManageOpportunities />} />
              <Route path="applications" element={<FounderApplications />} />
            </Route>
            <Route element={<RoleRoute roles={["collaborator"]} />}>
              <Route path="my-applications" element={<MyApplications />} />
            </Route>
            <Route element={<RoleRoute roles={["admin"]} />}>
              <Route path="users" element={<AdminUsers />} />
              <Route path="startups" element={<AdminStartups />} />
              <Route path="transactions" element={<Transactions />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
