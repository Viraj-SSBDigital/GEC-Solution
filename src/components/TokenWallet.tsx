import { useState } from "react";
import { GreenToken, AllocationLog } from "../types";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Modal } from "./Modal";
import { Wallet, Calendar, MapPin, Hash, Zap, List } from "lucide-react";
import { motion } from "framer-motion";
import { formatEnergy, getSourceColor } from "../utils/calculations";

interface TokenWalletProps {
  tokens: (GreenToken & { logs?: AllocationLog[] })[]; // include logs per token
  title?: string;
}

export const TokenWallet = ({
  tokens,
  title = "Token Wallet",
}: TokenWalletProps) => {
  const [selectedToken, setSelectedToken] = useState<GreenToken | any>(null);
  const [filter, setFilter] = useState<"all" | "generated" | "allocated">(
    "all"
  );

  const filteredTokens = tokens.filter((token) => {
    if (filter === "all") return true;
    return token.status === filter;
  });

  const totalUnits = filteredTokens.reduce(
    (sum, token) => sum + token.units,
    0
  );

  const getButtonClasses = (active: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      active
        ? "bg-emerald-500 text-white"
        : "bg-slate-200/10 dark:bg-slate-800/50 text-slate-800 dark:text-slate-400 hover:bg-slate-300/20 dark:hover:bg-slate-700"
    }`;

  return (
    <>
      <div className="space-y-4">
        {/* Header + Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
          <div className="flex items-center space-x-3">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={getButtonClasses(filter === "all")}
            >
              All ({tokens.length})
            </button>
            <button
              onClick={() => setFilter("generated")}
              className={getButtonClasses(filter === "generated")}
            >
              Available ({tokens.filter((t) => t.status === "generated").length}
              )
            </button>
            <button
              onClick={() => setFilter("allocated")}
              className={getButtonClasses(filter === "allocated")}
            >
              Allocated ({tokens.filter((t) => t.status === "allocated").length}
              )
            </button>
          </div>
        </div>

        {/* Total Energy Card */}
        <Card className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">
                Total Energy
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {formatEnergy(totalUnits)}
              </p>
            </div>
            <Zap className="w-12 h-12 text-emerald-400" />
          </div>
        </Card>

        {/* Token Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTokens.map((token, index) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                hoverable
                onClick={() => setSelectedToken(token)}
                className={`bg-slate-100/10 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 ${
                  token.consumed
                    ? "ring-2 ring-emerald-400"
                    : "ring-2 ring-orange-400"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant={
                        token.status === "allocated" ? "success" : "info"
                      }
                    >
                      {token.status}
                    </Badge>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getSourceColor(token.source) }}
                    />
                  </div>

                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {token.id}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {token.generatorName}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Generator ID: {token.generatorId}
                    </p>
                    {token.expiry && (
                      <p className="text-xs text-red-400 dark:text-red-500">
                        Expires:{" "}
                        {(() => {
                          const d = new Date(token.expiry);
                          const day = String(d.getDate()).padStart(2, "0");
                          const month = String(d.getMonth() + 1).padStart(
                            2,
                            "0"
                          ); // months are 0-indexed
                          const year = String(d.getFullYear()).slice(-2); // last 2 digits
                          return `${day}/${month}/${year}`;
                        })()}
                      </p>
                    )}

                    {/* Highlight consumed */}
                    <div className="mt-2 flex justify-end">
                      <Badge variant={token.consumed ? "success" : "warning"}>
                        {token.consumed ? "Consumed" : "Not Consumed"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 text-sm capitalize">
                      {token.source}
                    </span>
                    <span className="text-slate-900 dark:text-white font-semibold">
                      {formatEnergy(token.units)}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredTokens.length === 0 && (
          <Card className="bg-slate-100/10 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">
              No tokens found
            </p>
          </Card>
        )}
      </div>

      {/* Token Modal */}
      <Modal
        isOpen={selectedToken !== null}
        onClose={() => setSelectedToken(null)}
        title="Token Details"
        size="lg"
      >
        {selectedToken && (
          <div className="space-y-4">
            {/* Token Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">
                  Token ID
                </p>
                <p className="text-slate-900 dark:text-white font-semibold">
                  {selectedToken.id}
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">
                  Status
                </p>
                <Badge
                  variant={
                    selectedToken.status === "allocated" ? "success" : "info"
                  }
                >
                  {selectedToken.status}
                </Badge>
              </div>
            </div>

            {/* Consumed Status */}
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">
                Consumption Status
              </p>
              <Badge variant={selectedToken.consumed ? "success" : "warning"}>
                {selectedToken.consumed ? "Consumed" : "Not Consumed"}
              </Badge>

              {selectedToken.consumed && selectedToken.consumedDate && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {(() => {
                    const d = new Date(selectedToken.consumedDate);
                    const day = String(d.getDate()).padStart(2, "0");
                    const month = String(d.getMonth() + 1).padStart(2, "0");
                    const year = String(d.getFullYear()).slice(-2);
                    const time = d.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return `on ${day}/${month}/${year}, ${time}`;
                  })()}
                </p>
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Generator
                  </p>
                  <p className="text-slate-900 dark:text-white font-semibold">
                    {selectedToken.generatorName}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Generator ID: {selectedToken.generatorId}
                  </p>
                </div>
              </div>

              {/* Consumer Info */}
              {selectedToken.consumerId && (
                <div className="flex items-center space-x-3">
                  <Wallet className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Consumer
                    </p>
                    <p className="text-slate-900 dark:text-white font-semibold">
                      {selectedToken.consumerName || "N/A"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Consumer ID: {selectedToken.consumerId}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Generated
                  </p>
                  <p className="text-slate-900 dark:text-white font-semibold">
                    {new Date(selectedToken.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Location
                  </p>
                  <p className="text-slate-900 dark:text-white font-semibold">
                    {selectedToken.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Hash className="w-5 h-5 text-amber-400" />
                <div className="flex-1">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Hash
                  </p>
                  <p className="text-slate-900 dark:text-white font-mono text-xs break-all">
                    {selectedToken.hash}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Expiry
                </p>
                <p className="text-slate-900 dark:text-white font-semibold">
                  {selectedToken.expiry ? (
                    <p className="text-xs text-red-400 dark:text-red-500">
                      Expires:{" "}
                      {(() => {
                        const d = new Date(selectedToken.expiry);
                        const day = String(d.getDate()).padStart(2, "0");
                        const month = String(d.getMonth() + 1).padStart(2, "0");
                        const year = String(d.getFullYear()).slice(-2);
                        return `${day}/${month}/${year}`;
                      })()}
                    </p>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
            </div>

            {/* Logs Section */}
            {selectedToken.logs && selectedToken.logs.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <List className="w-5 h-5 text-violet-400" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Allocation Logs
                  </span>
                </div>
                {selectedToken.logs.map((log: any) => (
                  <Card
                    key={log.id}
                    className="bg-slate-100/10 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 p-3"
                  >
                    <div className="flex justify-between items-center text-sm">
                      <span>
                        {log.consumerName} ({log.units} units)
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {log.method.toUpperCase()} –{" "}
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};
