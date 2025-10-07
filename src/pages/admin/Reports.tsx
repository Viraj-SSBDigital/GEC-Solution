import { useData } from "../../contexts/DataContext";
import { Layout } from "../../components/Layout";
import { Card } from "../../components/Card";
import {
  BarChart,
  Bar,
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
import { Download, TrendingUp, Activity, Award } from "lucide-react";
import { formatEnergy, getSourceColor } from "../../utils/calculations";

export const AdminReports = () => {
  const { tokens, certificates, generators } = useData();

  const sourceDistribution = tokens.reduce((acc: any, token) => {
    const existing = acc.find((item: any) => item.name === token.source);
    if (existing) {
      existing.value += token.units;
    } else {
      acc.push({
        name: token.source,
        value: token.units,
        color: getSourceColor(token.source),
      });
    }
    return acc;
  }, []);

  const monthlyGeneration = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2024, i).toLocaleString("default", {
      month: "short",
    });
    return {
      month,
      tokens: Math.floor(Math.random() * 50) + 30,
      certificates: Math.floor(Math.random() * 40) + 20,
      energy: Math.floor(Math.random() * 15000) + 8000,
    };
  });

  const generatorComparison = generators.map((gen) => {
    const genTokens = tokens.filter((t) => t.generatorId === gen.id);
    const totalGen = genTokens.reduce((sum, t) => sum + t.units, 0);
    const allocated = genTokens.filter((t) => t.status === "allocated").length;
    return {
      name: gen.name.substring(0, 12) + "...",
      generated: totalGen,
      allocated: allocated,
    };
  });

  const weeklyTrend = Array.from({ length: 7 }, (_, i) => ({
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
    generation: Math.floor(Math.random() * 20000) + 10000,
    consumption: Math.floor(Math.random() * 18000) + 9000,
  }));

  const handleExport = (format: "json" | "csv") => {
    const reportData = {
      summary: {
        totalTokens: tokens.length,
        totalCertificates: certificates.length,
        totalGenerators: generators.length,
        totalEnergy: tokens.reduce((sum, t) => sum + t.units, 0),
      },
      generators: generators.map((g) => ({
        id: g.id,
        name: g.name,
        type: g.type,
        capacity: g.capacity,
      })),
      recentTokens: tokens.slice(0, 10),
      recentCertificates: certificates.slice(0, 10),
    };

    if (format === "json") {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `greenchain-report-${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const csv = [
        "Report Type,Value",
        `Total Tokens,${tokens.length}`,
        `Total Certificates,${certificates.length}`,
        `Total Generators,${generators.length}`,
        `Total Energy,${tokens.reduce((sum, t) => sum + t.units, 0)} kWh`,
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `greenchain-report-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header & Export Buttons */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Reports & Analytics
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Comprehensive system insights and data exports
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleExport("json")}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => handleExport("csv")}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 dark:bg-gray-900 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-400 text-sm mb-2">Total Energy</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatEnergy(tokens.reduce((sum, t) => sum + t.units, 0))}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  System-wide
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-emerald-400/50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 dark:bg-gray-900 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm mb-2">Active Tokens</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {tokens.length}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  In circulation
                </p>
              </div>
              <Activity className="w-12 h-12 text-cyan-400/50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 dark:bg-gray-900 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm mb-2">Certificates</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {certificates.length}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Issued to date
                </p>
              </div>
              <Award className="w-12 h-12 text-blue-400/50" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Distribution */}
          <Card className="dark:bg-gray-900 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Energy Source Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sourceDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Weekly Trend */}
          <Card className="dark:bg-gray-900 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Weekly Energy Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="generation"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Generation"
                />
                <Line
                  type="monotone"
                  dataKey="consumption"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Consumption"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Monthly Activity Trends */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Monthly Activity Trends
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyGeneration}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar dataKey="tokens" fill="#10b981" name="Tokens Generated" />
              <Bar
                dataKey="certificates"
                fill="#06b6d4"
                name="Certificates Issued"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Generator Comparison */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Generator Performance Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generatorComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar
                dataKey="generated"
                fill="#10b981"
                name="Energy Generated (kWh)"
              />
              <Bar dataKey="allocated" fill="#3b82f6" name="Tokens Allocated" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* System Summary */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 dark:bg-gray-900 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            System Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                Total Generators
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {generators.length}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                Tokens Generated
              </p>
              <p className="text-2xl font-bold text-emerald-400">
                {tokens.length}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                Tokens Allocated
              </p>
              <p className="text-2xl font-bold text-cyan-400">
                {tokens.filter((t) => t.status === "allocated").length}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                Certificates Issued
              </p>
              <p className="text-2xl font-bold text-blue-400">
                {certificates.length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
