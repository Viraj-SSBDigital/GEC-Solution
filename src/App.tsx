import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { Login } from "./pages/Login";
import { ConsumerDashboard } from "./pages/consumer/Dashboard";
import { ConsumerCertificates } from "./pages/consumer/Certificates";
import { ConsumerWallet } from "./pages/consumer/Wallet";
import { ConsumerAnalytics } from "./pages/consumer/Analytics";
import { GeneratorDashboard } from "./pages/generator/Dashboard";
import { GeneratorTokens } from "./pages/generator/Tokens";
import { GeneratorPerformance } from "./pages/generator/Performance";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminGenerators } from "./pages/admin/Generators";
import { AdminLedger } from "./pages/admin/Ledger";
import { AdminReports } from "./pages/admin/Reports";
import { ThemeProvider } from "./theme/ThemeProvider";
import TokenAssignmentConfig from "./pages/admin/TokenAssignmentConfig";
import TokenLogsAdmin from "./pages/admin/TokenLogs";
import Integrations from "./pages/admin/Integration";

const PrivateRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  // const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        // element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        element={<Login />}
      />

      <Route
        path="/consumer"
        element={
          <PrivateRoute allowedRoles={["consumer"]}>
            <ConsumerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/consumer/certificates"
        element={
          <PrivateRoute allowedRoles={["consumer"]}>
            <ConsumerCertificates />
          </PrivateRoute>
        }
      />
      <Route
        path="/consumer/wallet"
        element={
          <PrivateRoute allowedRoles={["consumer"]}>
            <ConsumerWallet />
          </PrivateRoute>
        }
      />
      <Route
        path="/consumer/analytics"
        element={
          <PrivateRoute allowedRoles={["consumer"]}>
            <ConsumerAnalytics />
          </PrivateRoute>
        }
      />

      <Route
        path="/generator"
        element={
          <PrivateRoute allowedRoles={["generator"]}>
            <GeneratorDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/generator/tokens"
        element={
          <PrivateRoute allowedRoles={["generator"]}>
            <GeneratorTokens />
          </PrivateRoute>
        }
      />
      <Route
        path="/generator/performance"
        element={
          <PrivateRoute allowedRoles={["generator"]}>
            <GeneratorPerformance />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/generators"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminGenerators />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/token-assignment"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <TokenAssignmentConfig />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/token-logs"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <TokenLogsAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/ledger"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminLedger />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminReports />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/integrations"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <Integrations />
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ThemeProvider>
            <AppRoutes />
          </ThemeProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
