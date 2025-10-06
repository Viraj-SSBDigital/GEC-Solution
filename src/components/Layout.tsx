import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Zap,
  LogOut,
  Home,
  FileText,
  Activity,
  Users,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // <--- Get current route

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNavItems = () => {
    switch (user?.role) {
      case "consumer":
        return [
          { icon: Home, label: "Dashboard", path: "/consumer" },
          {
            icon: FileText,
            label: "Certificates",
            path: "/consumer/certificates",
          },
          { icon: Activity, label: "Wallet", path: "/consumer/wallet" },
          { icon: BarChart3, label: "Analytics", path: "/consumer/analytics" },
        ];
      case "generator":
        return [
          { icon: Home, label: "Dashboard", path: "/generator" },
          { icon: Activity, label: "Tokens", path: "/generator/tokens" },
          {
            icon: BarChart3,
            label: "Performance",
            path: "/generator/performance",
          },
        ];
      case "admin":
        return [
          { icon: Home, label: "Dashboard", path: "/admin" },
          { icon: Users, label: "Generators", path: "/admin/generators" },
          { icon: Activity, label: "Ledger", path: "/admin/ledger" },
          { icon: BarChart3, label: "Reports", path: "/admin/reports" },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <Zap className="w-8 h-8 text-emerald-400" />
                <span className="text-xl font-bold text-white">GreenChain</span>
              </motion.div>

              <div className="hidden md:flex space-x-4">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path; // <--- Check active route

                  return (
                    <motion.button
                      key={item.path}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => navigate(item.path)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all
                        ${
                          isActive
                            ? "bg-emerald-500 text-white"
                            : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                        }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">
                  {user?.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 opacity-50"></div>
    </div>
  );
};
