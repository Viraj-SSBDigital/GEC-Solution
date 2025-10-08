import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Zap, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { UserRole } from "../types";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("consumer");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = login(email, role);
    if (success) {
      navigate(`/${role}`);
    } else {
      setError("Invalid credentials. Please check email and role.");
    }
  };

  const quickLogins = [
    {
      email: "consumer@example.com",
      role: "consumer" as UserRole,
      name: "Consumer Demo",
    },
    {
      email: "generator@example.com",
      role: "generator" as UserRole,
      name: "Generator Demo",
    },
    {
      email: "admin@example.com",
      role: "admin" as UserRole,
      name: "Admin Demo",
    },
  ];

  const handleQuickLogin = (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setRole(demoRole);
    const success = login(demoEmail, demoRole);
    if (success) {
      navigate(`/${demoRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 transition-colors">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <Zap className="w-12 h-12 text-emerald-500 dark:text-emerald-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Green Energy Certificate 
Solution
            </h1>
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">
            Blockchain-based Green Energy Certificate System
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-gray-300 dark:border-slate-800 rounded-xl p-8 transition-colors"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all appearance-none"
                >
                  <option value="consumer">Consumer</option>
                  <option value="generator">Generator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-cyan-600 dark:hover:from-emerald-500 dark:hover:to-cyan-500 transition-all shadow-lg shadow-emerald-500/20"
            >
              Sign In
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">
              Quick Demo Access:
            </p>
            <div className="space-y-2">
              {quickLogins.map((demo) => (
                <button
                  key={demo.email}
                  onClick={() => handleQuickLogin(demo.email, demo.role)}
                  className="w-full py-2 px-4 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 hover:border-emerald-500/50 transition-all text-sm"
                >
                  {demo.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
          Simulated system with mock data for demonstration
        </p>
      </motion.div>
    </div>
  );
};
