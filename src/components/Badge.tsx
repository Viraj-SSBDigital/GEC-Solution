interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "info" | "error" | "default";
  size?: "sm" | "md";
}

export const Badge = ({
  children,
  variant = "default",
  size = "md",
}: BadgeProps) => {
  const variants = {
    success:
      "bg-emerald-500/20 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/30 dark:text-emerald-400 dark:border-emerald-400/40",
    warning:
      "bg-amber-500/20 text-amber-600 border-amber-500/30 dark:bg-amber-500/30 dark:text-amber-400 dark:border-amber-400/40",
    info: "bg-blue-500/20 text-blue-600 border-blue-500/30 dark:bg-blue-500/30 dark:text-blue-400 dark:border-blue-400/40",
    error:
      "bg-red-500/20 text-red-600 border-red-500/30 dark:bg-red-500/30 dark:text-red-400 dark:border-red-400/40",
    default:
      "bg-slate-500/20 text-slate-600 border-slate-500/30 dark:bg-slate-700/30 dark:text-slate-400 dark:border-slate-600/40",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
};
