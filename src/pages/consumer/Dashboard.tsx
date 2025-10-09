import { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { Layout } from "../../components/Layout";
import { StatCard } from "../../components/Card";
import { Card } from "../../components/Card";
import { Zap, Award, Leaf, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  calculateSustainabilityMetrics,
  calculateEnergyMix,
  formatEnergy,
  formatCO2,
  getSourceColor,
} from "../../utils/calculations";

export const ConsumerDashboard = () => {
  const { tokens, certificates, energyData } = useData();
  const { user } = useAuth();

  const userCertificates = certificates.filter(
    (c) => c.consumerId === user?.id
  );
  const userTokens = tokens.filter((t) => t.consumerId === user?.id);

  const totalConsumption = energyData.reduce(
    (sum, d) => sum + d.consumption,
    0
  );
  const metrics = calculateSustainabilityMetrics(
    userCertificates,
    totalConsumption
  );
  const energyMix = calculateEnergyMix(userTokens);

  // Prepare chart data for the last 24 hours
  const consumptionChartData = energyData.slice(-24).map((d) => {
    // Find user's green energy in this hour from allocated tokens
    const hourTokens = userTokens.filter(
      (t) =>
        new Date(t.timestamp).getHours() === new Date(d.timestamp).getHours()
    );
    const greenEnergy = hourTokens.reduce((sum, t) => sum + t.units, 0);

    // Normal energy = total consumption - green energy (not less than 0)
    let normalEnergy = Math.max((d.consumption - greenEnergy) * 0.5, 0);

    // Reduce normal energy slightly (e.g., by 15%)

    return {
      time: new Date(d.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      green: greenEnergy,
      normal: normalEnergy,
      consumption: d.consumption, // total
    };
  });

  const totalNormal = consumptionChartData.reduce(
    (sum, d) => sum + d.normal,
    0
  );

  // Prepare pie data (merge renewable sources + Normal Energy)
  const pieData = [
    ...energyMix.map((item) => ({
      name: item.source,
      value: item.units,
      color: getSourceColor(item.source),
    })),
    {
      name: "Normal Energy",
      value: totalNormal,
      color: "#f59e0b", // amber/orange for conventional energy
    },
  ];

  // ======= Energy Mix Config =======
  const [customEnergyMixEnabled, setCustomEnergyMixEnabled] = useState(false);
  const energyMixOptions = ["Solar", "Wind", "Hydro", "Biomass"];
  const [selectedEnergyMix, setSelectedEnergyMix] = useState<string[]>([]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Energy Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track your green energy consumption and impact
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Zap className="w-8 h-8" />}
            label="Green Energy Used"
            value={formatEnergy(metrics.totalGreenEnergy)}
            trend={{ value: 12.5, positive: true }}
            color="emerald"
          />
          <StatCard
            icon={<Zap className="w-8 h-8" />}
            label="Normal Energy Used"
            value={formatEnergy(totalNormal)}
            trend={{ value: 0, positive: true }}
            color="cyan"
          />

          <StatCard
            icon={<Award className="w-8 h-8" />}
            label="Certificates"
            value={metrics.certificatesEarned}
            trend={{ value: 8.3, positive: true }}
            color="blue"
          />
          <StatCard
            icon={<Leaf className="w-8 h-8" />}
            label="CO₂ Offset"
            value={formatCO2(metrics.co2Saved)}
            trend={{ value: 15.7, positive: true }}
            color="cyan"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            label="Green Percentage"
            value={`${metrics.greenPercentage.toFixed(1)}%`}
            trend={{ value: 5.2, positive: true }}
            color="amber"
          />
        </div>
        {/* Energy Mix Configuration */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Configure Energy Mix
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={customEnergyMixEnabled}
              onChange={() =>
                setCustomEnergyMixEnabled(!customEnergyMixEnabled)
              }
            />
            <p className="text-gray-700 dark:text-gray-300">
              Enable Custom Energy Mix
            </p>
          </div>
          {customEnergyMixEnabled && (
            <div className="flex flex-wrap gap-2 mt-2">
              {energyMixOptions.map((source) => (
                <button
                  key={source}
                  onClick={() => {
                    if (selectedEnergyMix.includes(source)) {
                      setSelectedEnergyMix(
                        selectedEnergyMix.filter((s) => s !== source)
                      );
                    } else {
                      setSelectedEnergyMix([...selectedEnergyMix, source]);
                    }
                  }}
                  className={`px-3 py-1 rounded-lg border ${
                    selectedEnergyMix.includes(source)
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-400 dark:border-gray-700"
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="dark:bg-gray-900 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Energy Consumption (24h)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={consumptionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
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
                  dataKey="consumption"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Total Consumption"
                />
                <Line
                  type="monotone"
                  dataKey="green"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Green Energy"
                />
                <Line
                  type="monotone"
                  dataKey="normal"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Normal Energy"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="dark:bg-gray-900 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Energy Mix
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#94a3b8" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Environmental Impact */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 dark:bg-gradient-to-r dark:from-emerald-500/20 dark:to-cyan-500/20 dark:border-emerald-500/40">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Environmental Impact
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Your contribution to a sustainable future
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-emerald-400 text-sm mb-1">
                    Trees Equivalent
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.treesEquivalent}
                  </p>
                </div>
                <div>
                  <p className="text-cyan-400 text-sm mb-1">Clean Energy %</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.greenPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            <Leaf className="w-24 h-24 text-emerald-400/20" />
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {userTokens.slice(0, 5).map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between p-3 bg-gray-200/20 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getSourceColor(token.source) }}
                  />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {token.generatorName}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(token.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {formatEnergy(token.units)}
                  </p>
                  <p className="text-emerald-400 text-sm capitalize">
                    {token.source}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};
