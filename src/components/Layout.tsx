import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../theme/ThemeProvider";
import {
  Zap,
  LogOut,
  Home,
  FileText,
  Activity,
  Users,
  BarChart3,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left nav */}
            <div className="flex items-center space-x-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <Zap className="w-8 h-8 text-emerald-500" />
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  GreenChain
                </span>
              </motion.div>

              <div className="hidden md:flex space-x-4">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
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
                            : "text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                        }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Switch */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>

              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {user?.role}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all"
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
