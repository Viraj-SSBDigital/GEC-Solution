import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../../components/Layout';
import { StatCard, Card } from '../../components/Card';
import { Zap, Activity, Award, TrendingUp } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatEnergy } from '../../utils/calculations';

export const GeneratorDashboard = () => {
  const { tokens, certificates, generators, energyData } = useData();
  const { user } = useAuth();

  const generatorInfo = generators.find(g => g.name.includes(user?.name.split(' ')[0] || ''));
  const generatorTokens = generatorInfo ? tokens.filter(t => t.generatorId === generatorInfo.id) : [];
  const generatorCerts = generatorInfo ? certificates.filter(c => c.generatorId === generatorInfo.id) : [];

  const totalGenerated = generatorTokens.reduce((sum, t) => sum + t.units, 0);
  const totalAllocated = generatorTokens.filter(t => t.status === 'allocated').reduce((sum, t) => sum + t.units, 0);
  const allocationRate = totalGenerated > 0 ? (totalAllocated / totalGenerated) * 100 : 0;

  const generationData = energyData.slice(-24).map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    generation: Math.floor(Math.random() * 1000) + 500,
    capacity: generatorInfo?.capacity || 5000,
  }));

  const performanceData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    generation: Math.floor(Math.random() * 8000) + 4000,
    target: generatorInfo?.contractedCapacity || 4500,
  }));

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Generator Dashboard</h1>
          <p className="text-slate-400">{generatorInfo?.name || 'Generator Portal'}</p>
        </div>

        {generatorInfo && (
          <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Type</p>
                <p className="text-white font-semibold capitalize">{generatorInfo.type}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Capacity</p>
                <p className="text-white font-semibold">{formatEnergy(generatorInfo.capacity)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Location</p>
                <p className="text-white font-semibold">{generatorInfo.location}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Status</p>
                <p className="text-emerald-400 font-semibold capitalize">{generatorInfo.status}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Zap className="w-8 h-8" />}
            label="Total Generated"
            value={formatEnergy(totalGenerated)}
            trend={{ value: 15.3, positive: true }}
            color="emerald"
          />
          <StatCard
            icon={<Activity className="w-8 h-8" />}
            label="Tokens Created"
            value={generatorTokens.length}
            trend={{ value: 8.7, positive: true }}
            color="blue"
          />
          <StatCard
            icon={<Award className="w-8 h-8" />}
            label="Certificates Issued"
            value={generatorCerts.length}
            trend={{ value: 12.1, positive: true }}
            color="cyan"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            label="Allocation Rate"
            value={`${allocationRate.toFixed(1)}%`}
            trend={{ value: 5.4, positive: true }}
            color="amber"
          />
        </div>

        <Card>
          <h3 className="text-xl font-bold text-white mb-4">Real-Time Generation (24h)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={generationData}>
              <defs>
                <linearGradient id="colorGeneration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="generation"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorGeneration)"
                name="Generation (kWh)"
              />
              <Line
                type="monotone"
                dataKey="capacity"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Capacity"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-white mb-4">Weekly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="generation" stroke="#10b981" strokeWidth={3} name="Generation (kWh)" />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold text-white mb-4">Recent Tokens</h3>
            <div className="space-y-3">
              {generatorTokens.slice(0, 5).map((token) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{token.id}</p>
                    <p className="text-slate-400 text-sm">
                      {new Date(token.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{formatEnergy(token.units)}</p>
                    <p className="text-emerald-400 text-sm capitalize">{token.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-white mb-4">Allocation Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">Allocated Tokens</span>
                  <span className="text-emerald-400 font-semibold">{allocationRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${allocationRate}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Available</p>
                  <p className="text-white font-semibold">
                    {generatorTokens.filter(t => t.status === 'generated').length}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Allocated</p>
                  <p className="text-emerald-400 font-semibold">
                    {generatorTokens.filter(t => t.status === 'allocated').length}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
