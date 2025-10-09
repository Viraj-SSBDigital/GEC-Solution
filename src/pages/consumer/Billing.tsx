import { useMemo } from "react";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { Layout } from "../../components/Layout";
import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { motion } from "framer-motion";
import { Zap, Leaf, Coins, BarChart3, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatEnergy, formatCO2 } from "../../utils/calculations";

export const ConsumerBillingDashboard = () => {
  const { certificates } = useData();
  const { user } = useAuth();

  const userCertificates = certificates.filter(
    (c) => c.consumerId === user?.id
  );

  // Aggregate stats
  const totalEnergy = useMemo(
    () => userCertificates.reduce((sum, c) => sum + c.units, 0),
    [userCertificates]
  );

  const totalCO2 = useMemo(
    () => userCertificates.reduce((sum, c) => sum + c.co2Offset, 0),
    [userCertificates]
  );

  const totalBill = useMemo(() => totalEnergy * 0.12, [totalEnergy]); // ₹0.12 per unit

  // Group by source
  const energyBySource = useMemo(() => {
    const map: Record<string, number> = {};
    userCertificates.forEach((c) => {
      map[c.energySource] = (map[c.energySource] || 0) + c.units;
    });
    return Object.entries(map).map(([source, units]) => ({ source, units }));
  }, [userCertificates]);

  // Monthly trend data
  const monthlyData = useMemo(() => {
    const grouped: Record<string, { energy: number; cost: number }> = {};
    userCertificates.forEach((c) => {
      const month = new Date(c.generationTimestamp).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (!grouped[month]) grouped[month] = { energy: 0, cost: 0 };
      grouped[month].energy += c.units;
      grouped[month].cost += c.units * 0.12;
    });
    return Object.entries(grouped).map(([month, { energy, cost }]) => ({
      month,
      energy,
      cost,
    }));
  }, [userCertificates]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Energy Billing Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Track your energy usage, cost, and environmental impact
            </p>
          </div>
          <Badge variant="info" size="md">
            <Calendar className="w-4 h-4 mr-1" />
            Updated Monthly
          </Badge>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="dark:bg-gray-900 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Zap className="w-8 h-8 text-emerald-400" />
              <Badge variant="info">Total</Badge>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Energy Used</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatEnergy(totalEnergy)}
            </p>
          </Card>

          <Card className="dark:bg-gray-900 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Leaf className="w-8 h-8 text-cyan-400" />
              <Badge variant="success">Offset</Badge>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">CO₂ Saved</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCO2(totalCO2)}
            </p>
          </Card>

          <Card className="dark:bg-gray-900 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Coins className="w-8 h-8 text-amber-400" />
              <Badge variant="warning">Bill</Badge>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Total Billing
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ₹{totalBill.toFixed(2)}
            </p>
          </Card>
        </div>

        {/* Energy Breakdown */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Energy Breakdown by Source
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {energyBySource.map((item, idx) => (
              <motion.div
                key={item.source}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center text-center"
              >
                <BarChart3 className="w-8 h-8 text-emerald-400 mb-2" />
                <p className="text-gray-400 dark:text-gray-500 text-sm capitalize">
                  {item.source} Energy
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatEnergy(item.units)}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Monthly Trends */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Energy & Billing Trend
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis yAxisId="left" stroke="#10B981" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#F59E0B"
                  tickFormatter={(v: any) => `${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    color: "#F9FAFB",
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="energy"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Energy (kWh)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cost"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Cost (₹)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
