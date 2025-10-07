import { Layout } from "../../components/Layout";
import { useState, useEffect } from "react";
import { Clock, Zap, Hash, List, Calendar } from "lucide-react";
import {
  generateMockAllocationLogs,
  generateMockTokens,
  mockGenerators,
} from "../../utils/mockData";
import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { formatEnergy } from "../../utils/calculations";

export default function TokenLogsAdmin() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const tokens = generateMockTokens();
    const allocationLogs = generateMockAllocationLogs(tokens).map((log) => {
      const generator = mockGenerators.find((g) =>
        tokens.find((t) => t.id === log.tokenId && t.generatorId === g.id)
      );
      return {
        ...log,
        generatorName: generator?.name || "-",
        generatorId: generator?.id || "-",
      };
    });
    setLogs(allocationLogs);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen p-10 dark:bg-slate-950">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Token Allocation Logs
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Detailed allocation logs for all tokens. Admin view only.
          </p>
        </div>

        {/* Logs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {logs.map((log) => (
            <Card
              key={log.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="info">{log.method.toUpperCase()}</Badge>
                {log.alert && <span className="text-red-500">⚠️</span>}
              </div>

              <div className="space-y-2 text-sm text-slate-800 dark:text-slate-200">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold">{log.tokenId}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>
                    {log.generatorName} ({log.generatorId})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <List className="w-4 h-4 text-violet-400" />
                  <span>
                    {log.consumerName} ({log.consumerId})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>{formatEnergy(log.units)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </Card>
          ))}

          {logs.length === 0 && (
            <p className="text-center text-slate-500 dark:text-slate-400 col-span-full py-8">
              No logs found
            </p>
          )}
        </div>

        {/* Footer Status */}
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Clock className="w-5 h-5 text-amber-500" />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </Layout>
  );
}
