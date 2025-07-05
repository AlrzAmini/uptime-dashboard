export default function CustomLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-blue-950/60 backdrop-blur-sm z-50 select-none">
      <div className="relative w-24 h-24 mb-4">
        {/* Background Pulse Ring */}
        <svg
          className="w-full h-full animate-spin-slow text-blue-400 drop-shadow-lg"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray="251.2"
            strokeDashoffset="0"
            strokeLinecap="round"
          />
        </svg>

        {/* Bouncing Dot */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-300 rounded-full animate-bounce" />
      </div>

      <div className="text-xl font-bold tracking-wide text-blue-300 animate-pulse flex items-center gap-2">
        <span>⚙️</span> <span>Loading UptimeX...</span>
      </div>
    </div>
  );
}
