import { useState } from "react";
import {
  Settings,
  Layers,
  Users,
  Clock,
  AlertTriangle,
  Activity,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Layout } from "../../components/Layout";

export default function TokenAssignmentConfig() {
  const [validationInterval, setValidationInterval] = useState("30 Minutes");
  const [reconciliationFrequency, setReconciliationFrequency] =
    useState("Daily");
  const [allocationMode, setAllocationMode] = useState("Pro-Rata");
  const [openDropdown, setOpenDropdown] = useState<
    "interval" | "mode" | "reconciliation" | null
  >(null);

  const [auditEnabled, setAuditEnabled] = useState(true);
  const [consumerTiers, setConsumerTiers] = useState<any>({
    Commercial: true,
    Residential: true,
    Contracted: true,
  });
  const [touEnabled, setTouEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [selectedLogic, setSelectedLogic] = useState(allocationMode);

  // Energy Loss Modeling
  const [lossPercent, setLossPercent] = useState(0);
  const [lossAdjusted, setLossAdjusted] = useState(true);

  // RPO Tracking
  const [rpoEnabled, setRpoEnabled] = useState(true);
  const [tokenTag, setTokenTag] = useState<"rpo" | "voluntary">("rpo");

  const toggleDropdown = (dropdown: "interval" | "mode" | "reconciliation") => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <Layout>
      <div className="min-h-screen dark:bg-slate-950 p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Token Assignment Configuration
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2 text-base">
            Configure allocation intervals, reconciliation, logic, consumer
            tiers, energy loss, RPO tracking, and alerts.
          </p>
        </div>

        <div className="space-y-10">
          {/* Allocation Configuration */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border p-8 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Allocation Configuration
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-slate-700 dark:text-slate-300">
              {/* Validation Interval */}
              <div className="relative">
                <p className="font-medium mb-2 text-slate-800 dark:text-slate-200">
                  Validation Interval
                </p>
                <button
                  onClick={() => toggleDropdown("interval")}
                  className="w-full flex justify-between items-center border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-slate-800 dark:text-slate-200"
                >
                  <span>{validationInterval}</span>
                  <ChevronDown className="w-4 h-4 opacity-60" />
                </button>
                {openDropdown === "interval" && (
                  <ul className="absolute w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-md z-10 text-slate-800 dark:text-slate-200">
                    {[
                      "5 Minutes",
                      "15 Minutes",
                      "30 Minutes",
                      "1 Hour",
                      "2 Hours",
                    ].map((item) => (
                      <li
                        key={item}
                        className="px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                        onClick={() => {
                          setValidationInterval(item);
                          setOpenDropdown(null);
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Reconciliation Frequency */}
              <div className="relative">
                <p className="font-medium mb-2 text-slate-800 dark:text-slate-200">
                  Reconciliation Frequency
                  <span className="text-xs text-slate-400 dark:text-slate-500 block mt-1">
                    Reconcile available tokens vs. consumed units periodically
                  </span>
                </p>
                <button
                  onClick={() => toggleDropdown("reconciliation")}
                  className="w-full flex justify-between items-center border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-slate-800 dark:text-slate-200"
                >
                  <span>{reconciliationFrequency}</span>
                  <ChevronDown className="w-4 h-4 opacity-60" />
                </button>
                {openDropdown === "reconciliation" && (
                  <ul className="absolute w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-md z-10 text-slate-800 dark:text-slate-200">
                    {["Real-Time", "Hourly", "Daily"].map((item) => (
                      <li
                        key={item}
                        className="px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                        onClick={() => {
                          setReconciliationFrequency(item);
                          setOpenDropdown(null);
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Audit Logging */}
              <div>
                <p className="font-medium mb-2 text-slate-800 dark:text-slate-200">
                  Audit Logging
                </p>
                <div
                  onClick={() => setAuditEnabled(!auditEnabled)}
                  className="flex items-center gap-3 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 cursor-pointer text-slate-800 dark:text-slate-200"
                >
                  {auditEnabled ? (
                    <ToggleRight className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-400" />
                  )}
                  <span>{auditEnabled ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Allocation Logic */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border p-8 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Layers className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Allocation Logic Overview
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  title: "FIFO",
                  desc: "Assigns tokens in order of generation.",
                },
                {
                  title: "Pro-Rata",
                  desc: "Distributes tokens by consumption ratio.",
                },
                {
                  title: "Energy Mix",
                  desc: "Allocates tokens based on source blend.",
                },
              ].map((logic) => (
                <div
                  key={logic.title}
                  className={`p-4 rounded-lg cursor-pointer border ${
                    selectedLogic === logic.title
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                  } text-slate-800 dark:text-slate-200`}
                  onClick={() => {
                    setSelectedLogic(logic.title);
                    setAllocationMode(logic.title);
                  }}
                >
                  <p className="font-semibold">{logic.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {logic.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Consumer Tier & TOU */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border p-8 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-violet-500" />
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Consumer Tiers & Allocation
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.keys(consumerTiers).map((tier: any) => (
                <div
                  key={tier}
                  className="p-4 rounded-lg border flex justify-between items-center cursor-pointer text-slate-800 dark:text-slate-200"
                  style={{
                    backgroundColor: consumerTiers[tier]
                      ? "rgba(16,185,129,0.1)"
                      : "rgba(71,85,105,0.05)",
                  }}
                  onClick={() =>
                    setConsumerTiers({
                      ...consumerTiers,
                      [tier]: !consumerTiers[tier],
                    })
                  }
                >
                  <span>{tier}</span>
                  {consumerTiers[tier] ? (
                    <ToggleRight className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              ))}
            </div>
            <div
              className="mt-6 flex items-center gap-3 cursor-pointer text-slate-800 dark:text-slate-200"
              onClick={() => setTouEnabled(!touEnabled)}
            >
              <Clock className="w-5 h-5 text-amber-500" />
              <p className="text-sm">
                Time-of-Use (TOU) Allocation:{" "}
                <span className="font-medium text-emerald-500">
                  {touEnabled ? "Enabled" : "Disabled"}
                </span>
              </p>
            </div>
          </section>

          {/* Alerts & Exception Handling */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border p-8 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Alerts & Exception Handling
              </h2>
            </div>
            <div
              className="flex justify-between items-center border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer"
              style={{
                backgroundColor: alertsEnabled
                  ? "rgba(16,185,129,0.1)"
                  : "rgba(71,85,105,0.05)",
                color: alertsEnabled ? "#065f46" : "#475569",
              }}
              onClick={() => setAlertsEnabled(!alertsEnabled)}
            >
              <p className="text-sm">
                Trigger alerts when token supply is insufficient for demand.
              </p>
              {alertsEnabled ? (
                <ToggleRight className="w-6 h-6 text-emerald-500" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-400" />
              )}
            </div>
          </section>

          {/* Energy Loss Modeling */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border p-8 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Energy Loss Modeling
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Transmission & Distribution Loss (%):
                </p>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={lossPercent}
                  onChange={(e) => setLossPercent(Number(e.target.value))}
                  className="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1 w-20 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800"
                />
              </div>
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setLossAdjusted(!lossAdjusted)}
              >
                {lossAdjusted ? (
                  <ToggleRight className="w-6 h-6 text-emerald-500" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-slate-400" />
                )}
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  Apply loss-adjusted tokens for allocation
                </p>
              </div>
            </div>
          </section>

          {/* RPO & Certificate Tagging */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border p-8 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Layers className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                RPO Tracking & Certificate Tagging
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Enable RPO Tracking:
                </p>
                <div
                  onClick={() => setRpoEnabled(!rpoEnabled)}
                  className="flex items-center cursor-pointer"
                >
                  {rpoEnabled ? (
                    <ToggleRight className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-400" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Token Tag:
                </p>
                <select
                  value={tokenTag}
                  onChange={(e) =>
                    setTokenTag(e.target.value as "rpo" | "voluntary")
                  }
                  className="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800"
                >
                  <option value="rpo">RPO-Credited</option>
                  <option value="voluntary">Voluntary</option>
                </select>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generates reports aligned with regulatory formats for RPO
                submission.
              </p>
            </div>
          </section>

          {/* Footer Status */}
          <div className="flex justify-between items-center border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded-xl p-4 mt-10 text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              <span className="text-sm">
                Assignment Engine Status:{" "}
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Active
                </span>
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Last validated: 10 minutes ago
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
