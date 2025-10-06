import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { Zap, MapPin, Calendar, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Generator } from '../../types';
import { formatEnergy, getSourceColor } from '../../utils/calculations';

export const AdminGenerators = () => {
  const { generators, tokens, certificates } = useData();
  const [selectedGenerator, setSelectedGenerator] = useState<Generator | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredGenerators = generators.filter(gen => {
    if (filterType === 'all') return true;
    return gen.type === filterType;
  });

  const types = ['all', ...new Set(generators.map(g => g.type))];

  const getGeneratorStats = (genId: string) => {
    const genTokens = tokens.filter(t => t.generatorId === genId);
    const genCerts = certificates.filter(c => c.generatorId === genId);
    const totalGenerated = genTokens.reduce((sum, t) => sum + t.units, 0);
    const allocated = genTokens.filter(t => t.status === 'allocated').length;
    return { tokens: genTokens.length, certificates: genCerts.length, totalGenerated, allocated };
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Generator Management</h1>
            <p className="text-slate-400">Monitor and manage registered generators</p>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold text-white">{generators.length}</p>
              <p className="text-slate-400 text-sm">Active Generators</p>
            </div>
          </div>
        </div>

        <Card>
          <div className="flex gap-2">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  filterType === type
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGenerators.map((generator, index) => {
            const stats = getGeneratorStats(generator.id);
            return (
              <motion.div
                key={generator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hoverable onClick={() => setSelectedGenerator(generator)}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${getSourceColor(generator.type)}20` }}
                      >
                        <Zap className="w-6 h-6" style={{ color: getSourceColor(generator.type) }} />
                      </div>
                      <Badge variant={generator.status === 'active' ? 'success' : 'warning'}>
                        {generator.status}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{generator.name}</h3>
                      <p className="text-slate-400 text-sm capitalize">{generator.type} Energy</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Capacity</span>
                        <span className="text-white font-medium">{formatEnergy(generator.capacity)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Tokens</span>
                        <span className="text-emerald-400 font-semibold">{stats.tokens}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Certificates</span>
                        <span className="text-cyan-400 font-semibold">{stats.certificates}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <div className="flex items-center text-slate-400 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        {generator.location}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Modal
          isOpen={selectedGenerator !== null}
          onClose={() => setSelectedGenerator(null)}
          title="Generator Details"
          size="lg"
        >
          {selectedGenerator && (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div
                  className="p-6 rounded-2xl"
                  style={{ backgroundColor: `${getSourceColor(selectedGenerator.type)}20` }}
                >
                  <Zap className="w-16 h-16" style={{ color: getSourceColor(selectedGenerator.type) }} />
                </div>
              </div>

              <div className="text-center">
                <Badge variant={selectedGenerator.status === 'active' ? 'success' : 'warning'} size="md">
                  {selectedGenerator.status}
                </Badge>
                <h3 className="text-2xl font-bold text-white mt-4">{selectedGenerator.name}</h3>
                <p className="text-slate-400 mt-2 capitalize">{selectedGenerator.type} Energy Generator</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-950/50 rounded-lg">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Capacity</p>
                  <p className="text-2xl font-bold text-emerald-400">{formatEnergy(selectedGenerator.capacity)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Contracted</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {formatEnergy(selectedGenerator.contractedCapacity)}
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-800 pt-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm">Location</p>
                    <p className="text-white font-semibold">{selectedGenerator.location}</p>
                    <p className="text-slate-400 text-sm">
                      {selectedGenerator.latitude.toFixed(4)}, {selectedGenerator.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm">Commission Date</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedGenerator.commissionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Activity className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm">Performance</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-400">Utilization</span>
                        <span className="text-sm text-white font-semibold">
                          {((selectedGenerator.contractedCapacity / selectedGenerator.capacity) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${((selectedGenerator.contractedCapacity / selectedGenerator.capacity) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {(() => {
                const stats = getGeneratorStats(selectedGenerator.id);
                return (
                  <div className="grid grid-cols-3 gap-4 p-4 bg-slate-950/50 rounded-lg">
                    <div className="text-center">
                      <p className="text-slate-400 text-sm mb-1">Tokens</p>
                      <p className="text-2xl font-bold text-white">{stats.tokens}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-sm mb-1">Allocated</p>
                      <p className="text-2xl font-bold text-emerald-400">{stats.allocated}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-sm mb-1">Certificates</p>
                      <p className="text-2xl font-bold text-cyan-400">{stats.certificates}</p>
                    </div>
                  </div>
                );
              })()}

              <button
                onClick={() => setSelectedGenerator(null)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};
