import { ReactNode, useState, useRef, useEffect } from "react";
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
  Settings,
  Menu,
  X,
  Layers,
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

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          {
            icon: Settings,
            label: "Token Assignment Config",
            path: "/admin/token-assignment",
          },
          { icon: Activity, label: "Token Logs", path: "/admin/token-logs" },
          {
            icon: Layers,
            label: "Integrations & Migration",
            path: "/admin/integrations",
          },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      {/* Navbar */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl flex-shrink-0">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-fit items-center justify-between p-3">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 flex-shrink-0"
              >
                <Zap className="w-8 h-8 text-emerald-500" />
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  Green Energy Certificate Solution
                </span>
              </motion.div>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex flex-wrap justify-center gap-2 max-w-full">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.button
                    key={item.path}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
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

            {/* Right: mobile + user */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {user?.role}
                  </span>
                </button>

                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                  >
                    <button
                      onClick={toggleTheme}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Theme{" "}
                      {theme === "light" ? (
                        <Moon className="w-4 h-4" />
                      ) : (
                        <Sun className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Logout <LogOut className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    location.pathname === item.path
                      ? "bg-emerald-500 text-white"
                      : ""
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      {/* Bottom gradient */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 opacity-50"></div>
    </div>
  );
};
