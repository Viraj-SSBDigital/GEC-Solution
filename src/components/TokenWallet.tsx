import { useState } from 'react';
import { GreenToken } from '../types';
import { Card } from './Card';
import { Badge } from './Badge';
import { Modal } from './Modal';
import { Wallet, Calendar, MapPin, Hash, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { shortenHash } from '../utils/crypto';
import { formatEnergy, getSourceColor } from '../utils/calculations';

interface TokenWalletProps {
  tokens: GreenToken[];
  title?: string;
}

export const TokenWallet = ({ tokens, title = 'Token Wallet' }: TokenWalletProps) => {
  const [selectedToken, setSelectedToken] = useState<GreenToken | null>(null);
  const [filter, setFilter] = useState<'all' | 'generated' | 'allocated'>('all');

  const filteredTokens = tokens.filter(token => {
    if (filter === 'all') return true;
    return token.status === filter;
  });

  const totalUnits = filteredTokens.reduce((sum, token) => sum + token.units, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Wallet className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            All ({tokens.length})
          </button>
          <button
            onClick={() => setFilter('generated')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'generated'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            Available ({tokens.filter(t => t.status === 'generated').length})
          </button>
          <button
            onClick={() => setFilter('allocated')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'allocated'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            Allocated ({tokens.filter(t => t.status === 'allocated').length})
          </button>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm mb-1">Total Energy</p>
            <p className="text-3xl font-bold text-white">{formatEnergy(totalUnits)}</p>
          </div>
          <Zap className="w-12 h-12 text-emerald-400" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTokens.map((token, index) => (
          <motion.div
            key={token.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card hoverable onClick={() => setSelectedToken(token)}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={token.status === 'allocated' ? 'success' : 'info'}>
                    {token.status}
                  </Badge>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getSourceColor(token.source) }}
                  />
                </div>

                <div>
                  <p className="text-lg font-bold text-white">{token.id}</p>
                  <p className="text-sm text-slate-400">{token.generatorName}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-slate-400 text-sm capitalize">{token.source}</span>
                  <span className="text-white font-semibold">{formatEnergy(token.units)}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTokens.length === 0 && (
        <Card>
          <p className="text-center text-slate-400 py-8">No tokens found</p>
        </Card>
      )}

      <Modal
        isOpen={selectedToken !== null}
        onClose={() => setSelectedToken(null)}
        title="Token Details"
      >
        {selectedToken && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Token ID</p>
                <p className="text-white font-semibold">{selectedToken.id}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Status</p>
                <Badge variant={selectedToken.status === 'allocated' ? 'success' : 'info'}>
                  {selectedToken.status}
                </Badge>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Generator</p>
                    <p className="text-white font-semibold">{selectedToken.generatorName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Generated</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedToken.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Location</p>
                    <p className="text-white font-semibold">{selectedToken.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Hash className="w-5 h-5 text-amber-400" />
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm">Hash</p>
                    <p className="text-white font-mono text-xs break-all">{selectedToken.hash}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-semibold">Energy Units</span>
                <span className="text-2xl font-bold text-white">{formatEnergy(selectedToken.units)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
