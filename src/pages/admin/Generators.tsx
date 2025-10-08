import { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { Layout } from "../../components/Layout";
import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Modal } from "../../components/Modal";
import { Zap, MapPin, Calendar, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Generator } from "../../types";
import { formatEnergy, getSourceColor } from "../../utils/calculations";
import { useTheme } from "../../theme/ThemeProvider";

export const AdminGenerators = () => {
  const { generators, tokens, certificates } = useData();
  const { theme } = useTheme();
  const [selectedGenerator, setSelectedGenerator] = useState<Generator | null>(
    null
  );
  const [filterType, setFilterType] = useState<string>("all");

  const filteredGenerators = generators.filter((gen) => {
    if (filterType === "all") return true;
    return gen.type === filterType;
  });

  const types = ["all", ...new Set(generators.map((g) => g.type))];

  const getGeneratorStats = (genId: string) => {
    const genTokens = tokens.filter((t) => t.generatorId === genId);
    const genCerts = certificates.filter((c) => c.generatorId === genId);
    const totalGenerated = genTokens.reduce((sum, t) => sum + t.units, 0);
    const allocated = genTokens.filter((t) => t.status === "allocated").length;
    return {
      tokens: genTokens.length,
      certificates: genCerts.length,
      totalGenerated,
      allocated,
    };
  };

  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";
  const borderColor = isDark ? "border-slate-700" : "border-slate-200";

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${textPrimary}`}>
              Generator Management
            </h1>
            <p className={textSecondary}>
              Monitor and manage registered generators
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-emerald-400" />
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {generators.length}
              </p>
              <p className={`${textSecondary} text-sm`}>Active Generators</p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <Card className={`${cardBg} border ${borderColor}`}>
          <div className="flex gap-2 flex-wrap">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  filterType === type
                    ? "bg-emerald-500 text-white"
                    : `${
                        theme === "dark"
                          ? "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </Card>

        {/* Generators Grid */}
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
                <Card
                  hoverable
                  className={`${cardBg} border ${borderColor}`}
                  onClick={() => setSelectedGenerator(generator)}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div
                        className="p-3 rounded-lg"
                        style={{
                          backgroundColor: `${getSourceColor(
                            generator.type
                          )}20`,
                        }}
                      >
                        <Zap
                          className="w-6 h-6"
                          style={{ color: getSourceColor(generator.type) }}
                        />
                      </div>
                      <Badge
                        variant={
                          generator.status === "active" ? "success" : "warning"
                        }
                      >
                        {generator.status}
                      </Badge>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold mb-1 ${textPrimary}`}>
                        {generator.name} ({generator?.id})
                      </h3>
                      <p className={`${textSecondary} text-sm capitalize`}>
                        {generator.type} Energy
                      </p>
                    </div>

                    <div className={`space-y-2 pt-2 border-t ${borderColor}`}>
                      <div className="flex items-center justify-between text-sm">
                        <span className={textSecondary}>Capacity</span>
                        <span className={`${textPrimary} font-medium`}>
                          {formatEnergy(generator.capacity)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={textSecondary}>Tokens</span>
                        <span className="text-emerald-400 font-semibold">
                          {stats.tokens}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={textSecondary}>Certificates</span>
                        <span className="text-cyan-400 font-semibold">
                          {stats.certificates}
                        </span>
                      </div>
                    </div>

                    <div className={`pt-2 border-t ${borderColor}`}>
                      <div
                        className={`flex items-center text-sm ${textSecondary}`}
                      >
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
      </div>
      {/* Generator Modal */}
      {selectedGenerator ? (
        <Modal
          isOpen={selectedGenerator !== null}
          onClose={() => setSelectedGenerator(null)}
          title="Generator Details"
          size="lg"
        >
          {selectedGenerator && (
            <div className="space-y-6">
              {/* Icon */}
              <div className="flex items-center justify-center">
                <div
                  className="p-6 rounded-2xl"
                  style={{
                    backgroundColor: `${getSourceColor(
                      selectedGenerator.type
                    )}20`,
                  }}
                >
                  <Zap
                    className="w-16 h-16"
                    style={{ color: getSourceColor(selectedGenerator.type) }}
                  />
                </div>
              </div>

              {/* Name & Type */}
              <div className="text-center">
                <Badge
                  variant={
                    selectedGenerator.status === "active"
                      ? "success"
                      : "warning"
                  }
                  size="md"
                >
                  {selectedGenerator.status}
                </Badge>
                <h3 className={`text-2xl font-bold mt-4 ${textPrimary}`}>
                  {selectedGenerator.name} (ID: {selectedGenerator.id})
                </h3>
                <p className={`${textSecondary} mt-2 capitalize`}>
                  {selectedGenerator.type} Energy Generator
                </p>
              </div>

              {/* Capacity & Contract */}
              <div
                className={`grid grid-cols-2 gap-4 p-4 rounded-lg ${cardBg} border ${borderColor}`}
              >
                <div>
                  <p className={`${textSecondary} text-sm mb-1`}>
                    Total Capacity
                  </p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {formatEnergy(selectedGenerator.capacity)}
                  </p>
                </div>
                <div>
                  <p className={`${textSecondary} text-sm mb-1`}>Contracted</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {formatEnergy(selectedGenerator.contractedCapacity)}
                  </p>
                </div>
              </div>

              {/* Location, Commission, Performance */}
              <div className={`space-y-4 border-t ${borderColor} pt-4`}>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div className="flex-1">
                    <p className={`${textSecondary} text-sm`}>Location</p>
                    <p className={`${textPrimary} font-semibold`}>
                      {selectedGenerator.location}
                    </p>
                    <p className={`${textSecondary} text-sm`}>
                      {selectedGenerator.latitude.toFixed(4)},{" "}
                      {selectedGenerator.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <p className={`${textSecondary} text-sm`}>
                      Commission Date
                    </p>
                    <p className={`${textPrimary} font-semibold`}>
                      {new Date(
                        selectedGenerator.commissionDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Activity className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div className="flex-1">
                    <p className={`${textSecondary} text-sm`}>Performance</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-400">
                          Utilization
                        </span>
                        <span className="text-sm text-white font-semibold">
                          {(
                            (selectedGenerator.contractedCapacity /
                              selectedGenerator.capacity) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              (selectedGenerator.contractedCapacity /
                                selectedGenerator.capacity) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              {(() => {
                const stats = getGeneratorStats(selectedGenerator.id);
                return (
                  <div
                    className={`grid grid-cols-3 gap-4 p-4 rounded-lg ${cardBg} border ${borderColor}`}
                  >
                    {/* <div className="text-center">
                      <p className={`${textSecondary} text-sm mb-1`}>Tokens</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.tokens}
                      </p>
                    </div> */}
                    <div className="text-center">
                      <p className={`${textSecondary} text-sm mb-1`}>
                        Allocated
                      </p>
                      <p className="text-2xl font-bold text-emerald-400">
                        {stats.allocated}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className={`${textSecondary} text-sm mb-1`}>
                        Certificates
                      </p>
                      <p className="text-2xl font-bold text-cyan-400">
                        {stats.certificates}
                      </p>
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
      ) : null}
    </Layout>
  );
};
