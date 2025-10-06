import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { Award, Download, Search, CheckCircle, Calendar, MapPin, Zap, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { GreenEnergyCertificate } from '../../types';
import { formatEnergy, formatCO2, getSourceColor } from '../../utils/calculations';

export const ConsumerCertificates = () => {
  const { certificates } = useData();
  const { user } = useAuth();
  const [selectedCert, setSelectedCert] = useState<GreenEnergyCertificate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');

  const userCertificates = certificates.filter(c => c.consumerId === user?.id);

  const filteredCerts = userCertificates.filter(cert => {
    const matchesSearch =
      cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.generatorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === 'all' || cert.energySource === filterSource;
    return matchesSearch && matchesSource;
  });

  const sources = ['all', ...new Set(userCertificates.map(c => c.energySource))];

  const handleDownload = (cert: GreenEnergyCertificate) => {
    const data = JSON.stringify(cert, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cert.certificateNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Green Energy Certificates</h1>
            <p className="text-slate-400">View and manage your earned certificates</p>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold text-white">{userCertificates.length}</p>
              <p className="text-slate-400 text-sm">Total Certificates</p>
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
                placeholder="Search by certificate number or generator..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              {sources.map((source) => (
                <button
                  key={source}
                  onClick={() => setFilterSource(source)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    filterSource === source
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCerts.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hoverable onClick={() => setSelectedCert(cert)}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${getSourceColor(cert.energySource)}20` }}
                    >
                      <Award className="w-6 h-6" style={{ color: getSourceColor(cert.energySource) }} />
                    </div>
                    <Badge variant={cert.verified ? 'success' : 'warning'}>
                      {cert.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">Certificate Number</p>
                    <p className="text-white font-semibold font-mono text-sm">{cert.certificateNumber}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Generator</span>
                      <span className="text-white font-medium">{cert.generatorName}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Energy</span>
                      <span className="text-emerald-400 font-semibold">{formatEnergy(cert.units)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">CO₂ Offset</span>
                      <span className="text-cyan-400 font-semibold">{formatCO2(cert.co2Offset)}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(cert);
                    }}
                    className="w-full py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm font-medium transition-all flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCerts.length === 0 && (
          <Card>
            <p className="text-center text-slate-400 py-8">No certificates found</p>
          </Card>
        )}

        <Modal
          isOpen={selectedCert !== null}
          onClose={() => setSelectedCert(null)}
          title="Certificate Details"
          size="lg"
        >
          {selectedCert && (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div
                  className="p-6 rounded-2xl"
                  style={{ backgroundColor: `${getSourceColor(selectedCert.energySource)}20` }}
                >
                  <Award className="w-16 h-16" style={{ color: getSourceColor(selectedCert.energySource) }} />
                </div>
              </div>

              <div className="text-center">
                <Badge variant="success" size="md">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified Certificate
                </Badge>
                <h3 className="text-2xl font-bold text-white mt-4">{selectedCert.certificateNumber}</h3>
                <p className="text-slate-400 mt-2">Green Energy Certificate</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-950/50 rounded-lg">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Energy Generated</p>
                  <p className="text-2xl font-bold text-emerald-400">{formatEnergy(selectedCert.units)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">CO₂ Offset</p>
                  <p className="text-2xl font-bold text-cyan-400">{formatCO2(selectedCert.co2Offset)}</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-800 pt-4">
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm">Generator</p>
                    <p className="text-white font-semibold">{selectedCert.generatorName}</p>
                    <p className="text-slate-400 text-sm capitalize">{selectedCert.energySource} Energy</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm">Generation Date</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedCert.generationTimestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm">Issuance Date</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedCert.issuanceTimestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm">Location</p>
                    <p className="text-white font-semibold">{selectedCert.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Hash className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm">Blockchain Hash</p>
                    <p className="text-white font-mono text-xs break-all">{selectedCert.hash}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleDownload(selectedCert)}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Certificate</span>
                </button>
                <button
                  onClick={() => setSelectedCert(null)}
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
