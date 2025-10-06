import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card = ({
  children,
  className = "",
  hoverable = false,
  onClick,
}: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white/5 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-800 dark:border-slate-700 rounded-xl p-6
        ${
          hoverable
            ? "hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer transition-all duration-300"
            : ""
        }
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: string;
}

export const StatCard = ({
  icon,
  label,
  value,
  trend,
  color = "emerald",
}: StatCardProps) => {
  const colorClasses = {
    emerald:
      "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 dark:from-emerald-700/20 dark:to-emerald-800/20 dark:border-emerald-600/40",
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 dark:from-blue-700/20 dark:to-blue-800/20 dark:border-blue-600/40",
    cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 dark:from-cyan-700/20 dark:to-cyan-800/20 dark:border-cyan-600/40",
    amber:
      "from-amber-500/20 to-amber-600/20 border-amber-500/30 dark:from-amber-700/20 dark:to-amber-800/20 dark:border-amber-600/40",
  };

  return (
    <Card
      className={`bg-gradient-to-br ${
        colorClasses[color as keyof typeof colorClasses]
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
            {label}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {value}
          </p>
          {trend && (
            <p
              className={`text-sm ${
                trend.positive
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="text-slate-700 dark:text-white/80">{icon}</div>
      </div>
    </Card>
  );
};
