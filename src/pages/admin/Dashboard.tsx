import { useData } from "../../contexts/DataContext";
import { Layout } from "../../components/Layout";
import { StatCard, Card } from "../../components/Card";
import { Activity, Award, Users, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatEnergy } from "../../utils/calculations";
import { useTheme } from "../../theme/ThemeProvider";

export const AdminDashboard = () => {
  const { tokens, certificates, generators, energyData, allocationLogs } =
    useData();
  const { theme } = useTheme();

  const totalGenerated = tokens.reduce((sum, t) => sum + t.units, 0);
  const totalAllocated = tokens
    .filter((t) => t.status === "allocated")
    .reduce((sum, t) => sum + t.units, 0);
  const allocationRate =
    totalGenerated > 0 ? (totalAllocated / totalGenerated) * 100 : 0;

  const systemData = energyData.slice(-24).map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    generation: d.generation,
    consumption: d.consumption,
    green: d.greenGeneration,
  }));

  const generatorPerformance = generators.map((gen) => {
    const genTokens = tokens.filter((t) => t.generatorId === gen.id);
    const totalGen = genTokens.reduce((sum, t) => sum + t.units, 0);
    return {
      name: gen.name.length > 15 ? gen.name.substring(0, 15) + "..." : gen.name,
      generation: totalGen,
      capacity: gen.capacity,
    };
  });

  const isDark = theme === "dark";

  const axisStroke = isDark ? "#94a3b8" : "#475569";
  const gridStroke = isDark ? "#334155" : "#e2e8f0";
  const tooltipBg = isDark ? "#1e293b" : "#f1f5f9";
  const tooltipBorder = isDark ? "#334155" : "#cbd5e1";
  const tooltipText = isDark ? "#f8fafc" : "#1e293b";

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-200 mb-2">
            System Overview
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Monitor and manage the Green Energy Certificate 
Solution ecosystem
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Activity className="w-8 h-8" />}
            label="Total Tokens"
            value={tokens.length}
            trend={{ value: 18.2, positive: true }}
            color="emerald"
          />
          <StatCard
            icon={<Award className="w-8 h-8" />}
            label="Certificates Issued"
            value={certificates.length}
            trend={{ value: 14.7, positive: true }}
            color="blue"
          />
          <StatCard
            icon={<Users className="w-8 h-8" />}
            label="Active Generators"
            value={generators.filter((g) => g.status === "active").length}
            trend={{ value: 0, positive: true }}
            color="cyan"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            label="Allocation Rate"
            value={`${allocationRate.toFixed(1)}%`}
            trend={{ value: 6.3, positive: true }}
            color="amber"
          />
        </div>

        {/* System Energy Flow Chart */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-200 mb-4">
            System Energy Flow (24h)
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={systemData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="time" stroke={axisStroke} />
              <YAxis stroke={axisStroke} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "8px",
                  color: tooltipText,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="generation"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Generation"
              />
              <Line
                type="monotone"
                dataKey="consumption"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Consumption"
              />
              <Line
                type="monotone"
                dataKey="green"
                stroke="#10b981"
                strokeWidth={2}
                name="Green Energy"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Generator Performance Chart */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-200 mb-4">
            Generator Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generatorPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="name" stroke={axisStroke} />
              <YAxis stroke={axisStroke} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "8px",
                  color: tooltipText,
                }}
              />
              <Legend />
              <Bar dataKey="generation" fill="#10b981" name="Generated (kWh)" />
              <Bar dataKey="capacity" fill="#3b82f6" name="Capacity (kWh)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Allocations & System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-200 mb-4">
              Recent Allocations
            </h3>
            <div className="space-y-3">
              {allocationLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-gray-100 dark:bg-slate-700/40 rounded-lg"
                >
                  <div>
                    <p className="text-gray-900 dark:text-slate-200 font-medium">
                      {log.tokenId}
                    </p>
                    <p className="text-gray-500 dark:text-slate-400 text-sm">
                      {log.consumerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 dark:text-slate-200 font-semibold">
                      {formatEnergy(log.units)}
                    </p>
                    <p className="text-emerald-400 text-sm capitalize">
                      {log.method}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-200 mb-4">
              System Statistics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 dark:text-slate-400 text-sm">
                    Token Allocation
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    {allocationRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${allocationRate}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-300 dark:border-slate-700">
                <div>
                  <p className="text-gray-500 dark:text-slate-400 text-sm mb-1">
                    Total Generated
                  </p>
                  <p className="text-gray-900 dark:text-slate-200 font-semibold">
                    {formatEnergy(totalGenerated)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-slate-400 text-sm mb-1">
                    Total Allocated
                  </p>
                  <p className="text-emerald-400 font-semibold">
                    {formatEnergy(totalAllocated)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Platform Metrics */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/20 dark:border-emerald-500/30">
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-200 mb-4">
            Platform Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-500 dark:text-slate-400 text-sm mb-1">
                Total Tokens
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-200">
                {tokens.length}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-slate-400 text-sm mb-1">
                Certificates
              </p>
              <p className="text-2xl font-bold text-emerald-400">
                {certificates.length}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-slate-400 text-sm mb-1">
                Generators
              </p>
              <p className="text-2xl font-bold text-cyan-400">
                {generators.length}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-slate-400 text-sm mb-1">
                Allocations
              </p>
              <p className="text-2xl font-bold text-blue-400">
                {allocationLogs.length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
