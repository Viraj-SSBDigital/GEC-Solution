import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/Card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Calendar, Leaf } from 'lucide-react';
import { calculateSustainabilityMetrics, formatEnergy, formatCO2 } from '../../utils/calculations';

export const ConsumerAnalytics = () => {
  const { certificates, tokens, energyData } = useData();
  const { user } = useAuth();

  const userCertificates = certificates.filter(c => c.consumerId === user?.id);
  const userTokens = tokens.filter(t => t.consumerId === user?.id);

  const totalConsumption = energyData.reduce((sum, d) => sum + d.consumption, 0);
  const metrics = calculateSustainabilityMetrics(userCertificates, totalConsumption);

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2024, i).toLocaleString('default', { month: 'short' });
    return {
      month,
      greenEnergy: Math.floor(Math.random() * 5000) + 2000,
      co2Saved: Math.floor(Math.random() * 4000) + 1500,
    };
  });

  const sourceBreakdown = userTokens.reduce((acc: any, token) => {
    const existing = acc.find((item: any) => item.source === token.source);
    if (existing) {
      existing.units += token.units;
      existing.count += 1;
    } else {
      acc.push({ source: token.source, units: token.units, count: 1 });
    }
    return acc;
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Sustainability Analytics</h1>
          <p className="text-slate-400">Detailed insights into your environmental impact</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-400 text-sm mb-2">Total Green Energy</p>
                <p className="text-3xl font-bold text-white">{formatEnergy(metrics.totalGreenEnergy)}</p>
                <p className="text-slate-400 text-sm mt-2">Lifetime consumption</p>
              </div>
              <TrendingUp className="w-12 h-12 text-emerald-400/50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm mb-2">CO₂ Offset</p>
                <p className="text-3xl font-bold text-white">{formatCO2(metrics.co2Saved)}</p>
                <p className="text-slate-400 text-sm mt-2">Carbon reduction</p>
              </div>
              <Leaf className="w-12 h-12 text-cyan-400/50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm mb-2">Trees Equivalent</p>
                <p className="text-3xl font-bold text-white">{metrics.treesEquivalent}</p>
                <p className="text-slate-400 text-sm mt-2">Environmental impact</p>
              </div>
              <Calendar className="w-12 h-12 text-blue-400/50" />
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="text-xl font-bold text-white mb-4">Monthly Green Energy Consumption</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="greenEnergy"
                stroke="#10b981"
                strokeWidth={3}
                name="Green Energy (kWh)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-white mb-4">CO₂ Savings Over Time</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="co2Saved" fill="#06b6d4" name="CO₂ Saved (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-white mb-4">Energy Source Distribution</h3>
          <div className="space-y-4">
            {sourceBreakdown.map((item: any) => {
              const percentage = (item.units / metrics.totalGreenEnergy) * 100;
              return (
                <div key={item.source}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium capitalize">{item.source}</span>
                    <span className="text-slate-400">
                      {formatEnergy(item.units)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-500/20">
            <h3 className="text-lg font-bold text-white mb-4">Impact Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Clean Energy Percentage</span>
                <span className="text-emerald-400 font-semibold">{metrics.greenPercentage.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Certificates</span>
                <span className="text-cyan-400 font-semibold">{metrics.certificatesEarned}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Tokens</span>
                <span className="text-blue-400 font-semibold">{userTokens.length}</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <h3 className="text-lg font-bold text-white mb-4">Environmental Equivalents</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Trees Planted</span>
                <span className="text-emerald-400 font-semibold">{metrics.treesEquivalent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cars Off Road (days)</span>
                <span className="text-cyan-400 font-semibold">{Math.floor(metrics.co2Saved / 4.6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Homes Powered (hours)</span>
                <span className="text-blue-400 font-semibold">{Math.floor(metrics.totalGreenEnergy / 30)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
