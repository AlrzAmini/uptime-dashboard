import { useEffect, useState } from "react";
import { getServices, analyzeUptime } from "../services/monitoredServices";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomLoading from "../components/CustomLoading";

interface UptimeCheck {
  id: string;
  isHealthy: boolean;
  responseTimeMs: number;
  isUnderSla: boolean;
  httpStatusCode: number;
  errorMessage?: string;
  at: string;
}

interface ServiceUptimeGroup {
  monitoredServiceId: string;
  monitoredServiceName: string;
  items: UptimeCheck[];
  itemsCount: number;
  isUnderSlaItemsCount: number;
  isUpperThanSlaItemsCount: number;
  uptimePercentage: number;
}

export default function UptimeReport() {
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [data, setData] = useState<ServiceUptimeGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<{
    [id: string]: boolean;
  }>({});

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 1000;
  const [totalPages, setTotalPages] = useState(1);

  async function loadServices() {
    const s = await getServices();
    setServices(s);
  }

  async function fetchReport() {
    setLoading(true);
    try {
      const result = await analyzeUptime({
        monitoredServiceId: selectedServiceId || undefined,
        from: fromDate ? fromDate.toISOString() : undefined,
        to: toDate ? toDate.toISOString() : undefined,
        pageNumber,
        pageSize,
      });

      setData(result.items);

      // Assuming your API returns totalCount for pagination
      if (result.totalCount !== undefined) {
        setTotalPages(Math.ceil(result.totalCount / pageSize));
      } else {
        // fallback if totalCount not available
        setTotalPages(1);
      }

      const collapseState: { [id: string]: boolean } = {};
      result.items.forEach(
        (group) => (collapseState[group.monitoredServiceId] = false)
      );
      setExpandedGroups(collapseState);
    } catch (err) {
      console.error("Failed to fetch report", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  // Fetch report whenever filters or pageNumber change
  useEffect(() => {
    fetchReport();
  }, [selectedServiceId, fromDate, toDate, pageNumber]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1);
  }, [selectedServiceId, fromDate, toDate]);

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">
        📊 Uptime Report
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          className="bg-gray-800/60 text-white p-2 rounded-xl border border-gray-600 backdrop-blur-md"
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
        >
          <option value="">All Services</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <DatePicker
          selected={fromDate}
          onChange={(date) => setFromDate(date)}
          placeholderText="From Date (optional)"
          className="bg-gray-800/60 text-white p-2 rounded-xl border border-gray-600 backdrop-blur-md w-full"
        />

        <DatePicker
          selected={toDate}
          onChange={(date) => setToDate(date)}
          placeholderText="To Date (optional)"
          className="bg-gray-800/60 text-white p-2 rounded-xl border border-gray-600 backdrop-blur-md w-full"
        />
      </div>

      <>
        <button
          className="px-4 py-2 rounded-xl bg-blue-500/30 text-blue-200 hover:bg-blue-500/50 backdrop-blur-md transition flex justify-center items-center"
          onClick={fetchReport}
          disabled={loading}
        >
          {loading ? "Loading..." : "🔍 Analyze"}
        </button>
        {loading && <CustomLoading />} 
      </>

      {data.length === 0 && (
        <p className="text-gray-400 mt-4">No data to display.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
        {data.map((group) => (
          <div
            key={group.monitoredServiceId}
            className="rounded-2xl p-6 bg-white/10 backdrop-blur-lg border border-white/10 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                🧪 {group.monitoredServiceName}
              </h2>
              <button
                className="text-sm px-3 py-1 rounded-xl bg-blue-500/20 text-blue-200 hover:bg-blue-500/40 transition"
                onClick={() => toggleGroup(group.monitoredServiceId)}
              >
                {expandedGroups[group.monitoredServiceId]
                  ? "Hide Details"
                  : "Show Details"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              <div>
                📦 Total Checks:{" "}
                <span className="font-bold text-white">{group.itemsCount}</span>
              </div>
              <div>
                ✔️ SLA Passed:{" "}
                <span className="font-bold text-white">
                  {group.isUnderSlaItemsCount}
                </span>
              </div>
              <div>
                🚨 Over SLA Time:{" "}
                <span className="font-bold text-white">
                  {group.isUpperThanSlaItemsCount}
                </span>
              </div>
              <div>
                ✅ Uptime:{" "}
                <span className="font-bold text-white">
                  {group.uptimePercentage}%
                </span>
              </div>
            </div>

            {expandedGroups[group.monitoredServiceId] && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl p-4 bg-gray-900/40 border border-gray-700 text-sm text-gray-300 hover:border-blue-400 transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`${
                          item.isHealthy ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {item.isHealthy ? "🟢 Healthy" : "🔴 Down"}
                      </span>
                      <span
                        className={`${
                          item.isUnderSla ? "text-green-300" : "text-red-400"
                        }`}
                      >
                        SLA: {item.isUnderSla ? "✔️ OK" : "⚠️ Over Limit"}
                      </span>
                    </div>
                    <p>📡 Status: {item.httpStatusCode}</p>
                    <p>⚡ Response: {item.responseTimeMs} ms</p>
                    <p>🕒 {new Date(item.at).toLocaleString()}</p>
                    {item.errorMessage && (
                      <p className="mt-2 text-red-300 italic">
                        ❗ {item.errorMessage}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          className="px-3 py-1 rounded bg-blue-500/30 text-blue-200 disabled:opacity-40"
          onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          disabled={pageNumber === 1}
        >
          Prev
        </button>

        <span className="text-blue-300">
          Page {pageNumber} of {totalPages}
        </span>

        <button
          className="px-3 py-1 rounded bg-blue-500/30 text-blue-200 disabled:opacity-40"
          onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
          disabled={pageNumber === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
