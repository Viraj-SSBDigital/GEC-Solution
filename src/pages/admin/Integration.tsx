import { useState } from "react";
import {
  Server,
  Database,
  Layers,
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
} from "lucide-react";
import { Layout } from "../../components/Layout";

interface Integration {
  name: string;
  type: "API" | "Data Connector" | "SSO";
  lastSync: string;
  status: "connected" | "disconnected" | "syncing";
}

export default function Integrations() {
  const [integrations, setIntegrations] = useState<any[]>([
    {
      name: "SAP (Billing & Contracts)",
      type: "API",
      lastSync: "2025-10-07 08:30",
      status: "connected",
    },
    {
      name: "Customer Portal & Mobile App",
      type: "API",
      lastSync: "2025-10-07 08:45",
      status: "connected",
    },
    {
      name: "Meter Data Management (MDM) System",
      type: "Data Connector",
      lastSync: "2025-10-07 08:50",
      status: "syncing",
    },
    {
      name: "Adani-IC & SCADA Systems",
      type: "Data Connector",
      lastSync: "2025-10-07 08:40",
      status: "connected",
    },
    {
      name: "Adani SSO Solution",
      type: "SSO",
      lastSync: "2025-10-07 08:35",
      status: "connected",
    },
    {
      name: "Power BI Dashboard",
      type: "API",
      lastSync: "2025-10-07 08:20",
      status: "disconnected",
    },
  ]);

  const statusColor = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return "text-green-500";
      case "syncing":
        return "text-yellow-500";
      case "disconnected":
        return "text-red-500";
    }
  };

  const refreshStatus = () => {
    // This is a placeholder for actual refresh logic (API call)
    const updated = integrations.map((i) => ({
      ...i,
      lastSync: new Date().toLocaleString(),
      status: Math.random() > 0.2 ? "connected" : "syncing", // dummy status
    }));
    setIntegrations(updated);
  };

  return (
    <Layout>
      <div className="min-h-screen p-10 dark:bg-slate-950">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Integration & Migration Status
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2 text-base">
            Monitor integration health and data migration status across all AEML
            systems connected to the Green Energy Certificate platform.
          </p>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={refreshStatus}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Status
          </button>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-md flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-4">
                {integration.type === "API" && (
                  <Server className="w-6 h-6 text-blue-500" />
                )}
                {integration.type === "Data Connector" && (
                  <Database className="w-6 h-6 text-cyan-500" />
                )}
                {integration.type === "SSO" && (
                  <Layers className="w-6 h-6 text-purple-500" />
                )}
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {integration.name}
                </h2>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Last Sync: {integration.lastSync}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {integration.status === "connected" && (
                    <CheckCircle
                      className={`w-5 h-5 ${statusColor(integration.status)}`}
                    />
                  )}
                  {integration.status === "syncing" && (
                    <Clock
                      className={`w-5 h-5 ${statusColor(integration.status)}`}
                    />
                  )}
                  {integration.status === "disconnected" && (
                    <XCircle
                      className={`w-5 h-5 ${statusColor(integration.status)}`}
                    />
                  )}
                  <span
                    className={`text-sm font-medium ${statusColor(
                      integration.status
                    )}`}
                  >
                    {integration.status.charAt(0).toUpperCase() +
                      integration.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Notes */}
        <div className="mt-10 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm">
          <p>
            This panel provides a high-level overview of all active integrations
            and migration pipelines. Any disconnected or syncing systems should
            be investigated to ensure data consistency and regulatory
            compliance.
          </p>
        </div>
      </div>
    </Layout>
  );
}
