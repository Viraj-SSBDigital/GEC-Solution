import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserRole } from '../types';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('consumer');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(email, role);
    if (success) {
      console.log('login success');
      navigate(`/${role}`);
    } else {
      setError('Invalid credentials. Please check email and role.');
    }
  };

  const quickLogins = [
    { email: 'consumer@example.com', role: 'consumer' as UserRole, name: 'Consumer Demo' },
    { email: 'generator@example.com', role: 'generator' as UserRole, name: 'Generator Demo' },
    { email: 'admin@example.com', role: 'admin' as UserRole, name: 'Admin Demo' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <Zap className="w-12 h-12 text-emerald-400" />
            <h1 className="text-4xl font-bold text-white">GreenChain</h1>
          </motion.div>
          <p className="text-slate-400">Blockchain-based Green Energy Certificate System</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Role
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all appearance-none"
                >
                  <option value="consumer">Consumer</option>
                  <option value="generator">Generator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/20"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6">
            <p className="text-sm text-slate-400 text-center mb-3">Quick Demo Access:</p>
            <div className="space-y-2">
              {quickLogins.map((demo) => (
                <button
                  key={demo.email}
                  onClick={() => handleQuickLogin(demo.email, demo.role)}
                  className="w-full py-2 px-4 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 hover:border-emerald-500/50 transition-all text-sm"
                >
                  {demo.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Simulated system with mock data for demonstration
        </p>
      </motion.div>
    </div>
  );
};
