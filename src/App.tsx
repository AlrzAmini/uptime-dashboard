import { NavLink, Routes, Route } from "react-router-dom";
import Services from "./pages/Services";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/UptimeReport";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white font-sans">
      {/* Header */}
      <header className="p-4 flex justify-between items-center shadow-md backdrop-blur-md bg-gray-800/30">
        <h1 className="text-xl font-bold text-green-400">UptimeX Dashboard</h1>
        <nav className="flex gap-4">
          <NavLink to="/" className="glass-button">Dashboard</NavLink>
          <NavLink to="/services" className="glass-button">Services</NavLink>
          <NavLink to="/analyze" className="glass-button">Analyze</NavLink>
        </nav>
      </header>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/analyze" element={<Analyze />} />
      </Routes>
    </div>
  );
}

export default App;
