import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { Layout } from "../../components/Layout";
import { Card } from "../../components/Card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Activity, TrendingUp, Award } from "lucide-react";
import { formatEnergy } from "../../utils/calculations";

export const GeneratorPerformance = () => {
  const { tokens, certificates, generators } = useData();
  const { user } = useAuth();

  const generatorInfo = generators.find((g) =>
    g.name.includes(user?.name.split(" ")[0] || "")
  );
  const generatorTokens = generatorInfo
    ? tokens.filter((t) => t.generatorId === generatorInfo.id)
    : [];
  const generatorCerts = generatorInfo
    ? certificates.filter((c) => c.generatorId === generatorInfo.id)
    : [];

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2024, i).toLocaleString("default", {
      month: "short",
    });
    return {
      month,
      generated: Math.floor(Math.random() * 8000) + 4000,
      allocated: Math.floor(Math.random() * 6000) + 3000,
      certificates: Math.floor(Math.random() * 50) + 20,
    };
  });

  const efficiencyData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    efficiency: Math.floor(Math.random() * 20) + 75,
    uptime: Math.floor(Math.random() * 10) + 90,
  }));

  const totalGenerated = generatorTokens.reduce((sum, t) => sum + t.units, 0);
  const totalAllocated = generatorTokens
    .filter((t) => t.status === "allocated")
    .reduce((sum, t) => sum + t.units, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Performance Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Detailed performance metrics and trends
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 dark:bg-gradient-to-br dark:from-emerald-500/30 dark:to-emerald-600/30 dark:border-emerald-500/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-400 text-sm mb-2">Total Generated</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatEnergy(totalGenerated)}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Lifetime production
                </p>
              </div>
              <Activity className="w-12 h-12 text-emerald-400/50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 dark:bg-gradient-to-br dark:from-cyan-500/30 dark:to-cyan-600/30 dark:border-cyan-500/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm mb-2">Allocation Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalGenerated > 0
                    ? ((totalAllocated / totalGenerated) * 100).toFixed(1)
                    : 0}
                  %
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Token utilization
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-cyan-400/50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 dark:bg-gradient-to-br dark:from-blue-500/30 dark:to-blue-600/30 dark:border-blue-500/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm mb-2">
                  Certificates Issued
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {generatorCerts.length}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Total issued
                </p>
              </div>
              <Award className="w-12 h-12 text-blue-400/50" />
            </div>
          </Card>
        </div>

        {/* Monthly Generation Trends */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Monthly Generation Trends
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Legend wrapperStyle={{ color: "#fff" }} />
              <Line
                type="monotone"
                dataKey="generated"
                stroke="#10b981"
                strokeWidth={3}
                name="Generated (kWh)"
              />
              <Line
                type="monotone"
                dataKey="allocated"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Allocated (kWh)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly Certificate Issuance */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Monthly Certificate Issuance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Legend wrapperStyle={{ color: "#fff" }} />
              <Bar
                dataKey="certificates"
                fill="#06b6d4"
                name="Certificates Issued"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Efficiency & Uptime */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Efficiency & Uptime
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Legend wrapperStyle={{ color: "#fff" }} />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#10b981"
                strokeWidth={3}
                name="Efficiency (%)"
              />
              <Line
                type="monotone"
                dataKey="uptime"
                stroke="#f59e0b"
                strokeWidth={3}
                name="Uptime (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Generator Details */}
        {generatorInfo && (
          <Card className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 dark:bg-gradient-to-r dark:from-emerald-500/20 dark:to-cyan-500/20 dark:border-emerald-500/30">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Generator Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Capacity
                </p>
                <p className="text-gray-900 dark:text-white font-semibold">
                  {formatEnergy(generatorInfo.capacity)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Contracted
                </p>
                <p className="text-emerald-400 font-semibold">
                  {formatEnergy(generatorInfo.contractedCapacity)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Utilization
                </p>
                <p className="text-cyan-400 font-semibold">
                  {(
                    (generatorInfo.contractedCapacity /
                      generatorInfo.capacity) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Status
                </p>
                <p className="text-emerald-400 font-semibold capitalize">
                  {generatorInfo.status}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};
