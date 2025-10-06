import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { Database, Hash, Calendar, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { BlockchainTransaction } from '../../types';
import { shortenHash } from '../../utils/crypto';

export const AdminLedger = () => {
  const { blockchain } = useData();
  const [selectedTx, setSelectedTx] = useState<BlockchainTransaction | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = blockchain.filter(tx => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const types = ['all', 'token_generation', 'token_allocation', 'gec_issuance'];

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      token_generation: 'Token Generated',
      token_allocation: 'Token Allocated',
      gec_issuance: 'GEC Issued',
    };
    return labels[type] || type;
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, 'success' | 'info' | 'warning'> = {
      token_generation: 'success',
      token_allocation: 'info',
      gec_issuance: 'warning',
    };
    return variants[type] || 'default';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Blockchain Ledger</h1>
            <p className="text-slate-400">Immutable transaction history</p>
          </div>
          <div className="flex items-center space-x-2">
            <Database className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold text-white">{blockchain.length}</p>
              <p className="text-slate-400 text-sm">Transactions</p>
            </div>
          </div>
        </div>

        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID or hash..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    filterType === type
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {type === 'all' ? 'All' : getTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          {filteredTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <Card hoverable onClick={() => setSelectedTx(tx)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-lg">
                      <Database className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <p className="text-white font-semibold">{tx.id}</p>
                        <Badge variant={getTypeBadge(tx.type)} size="sm">
                          {getTypeLabel(tx.type)}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-sm font-mono">
                        Hash: {shortenHash(tx.hash, 12)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                    <p className="text-slate-500 text-xs font-mono mt-1">
                      Prev: {shortenHash(tx.previousHash, 6)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <Card>
            <p className="text-center text-slate-400 py-8">No transactions found</p>
          </Card>
        )}

        <Modal
          isOpen={selectedTx !== null}
          onClose={() => setSelectedTx(null)}
          title="Transaction Details"
          size="lg"
        >
          {selectedTx && (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="p-6 bg-emerald-500/20 rounded-2xl">
                  <Database className="w-16 h-16 text-emerald-400" />
                </div>
              </div>

              <div className="text-center">
                <Badge variant={getTypeBadge(selectedTx.type)} size="md">
                  {getTypeLabel(selectedTx.type)}
                </Badge>
                <h3 className="text-2xl font-bold text-white mt-4">{selectedTx.id}</h3>
                <p className="text-slate-400 mt-2">Blockchain Transaction</p>
              </div>

              <div className="space-y-4 border-t border-slate-800 pt-4">
                <div className="flex items-start space-x-3">
                  <Hash className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm">Transaction Hash</p>
                    <p className="text-white font-mono text-xs break-all">{selectedTx.hash}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Hash className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm">Previous Hash</p>
                    <p className="text-white font-mono text-xs break-all">{selectedTx.previousHash}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm">Timestamp</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedTx.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <p className="text-slate-400 text-sm mb-2">Transaction Data</p>
                <div className="bg-slate-950/50 rounded-lg p-4 max-h-64 overflow-auto">
                  <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">
                    {JSON.stringify(selectedTx.data, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    const data = JSON.stringify(selectedTx, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedTx.id}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all"
                >
                  Export Transaction
                </button>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};
