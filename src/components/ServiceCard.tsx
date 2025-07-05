type MonitoredService = {
  id: string;
  name: string;
  url: string;
  description?: string;
  isActive: boolean;
  ownerTeam?: string;
  lastCheckedAt?: string;
  lastCheckSucceeded: boolean;
  lastResponseTimeMs?: number;
  tags?: string[];
};

export default function ServiceCard({
  service,
  onEdit,
  onDelete,
}: {
  service: MonitoredService;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const {
    id,
    name,
    url,
    description,
    lastCheckSucceeded,
    lastResponseTimeMs,
    lastCheckedAt,
    ownerTeam,
    tags,
  } = service;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/10 hover:border-blue-500 transition">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-blue-400">{name}</h2>
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            lastCheckSucceeded ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          {lastCheckSucceeded ? "✅ Up" : "❌ Down"}
        </span>
      </div>

      <p className="text-sm text-gray-300 break-all">{url}</p>

      {description && <p className="text-sm text-gray-400 mt-1 italic">{description}</p>}

      <div className="mt-3 flex flex-wrap text-xs text-gray-400 gap-3">
        {ownerTeam && <span>👥 {ownerTeam}</span>}
        {lastResponseTimeMs !== undefined && <span>⚡ {lastResponseTimeMs} ms</span>}
        {lastCheckedAt && (
          <span>🕒 Last Checked: {new Date(lastCheckedAt).toLocaleString()}</span>
        )}
        {tags && tags.length > 0 && <span className="text-blue-300">🏷️ {tags.join(", ")}</span>}
      </div>

      <div className="mt-4 flex justify-end gap-4">
        {onEdit && (
          <button
            onClick={() => onEdit(id)}
            className="text-sm text-blue-400 hover:underline"
            aria-label={`Edit service ${name}`}
          >
            ✏️ Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
                onDelete(id);
              }
            }}
            className="text-sm text-red-400 hover:underline"
            aria-label={`Delete service ${name}`}
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
}
