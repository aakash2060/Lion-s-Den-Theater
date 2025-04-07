import { FaChartBar } from "react-icons/fa";
import TicketSalesChart from "./TicketSalesChart";
import { Link } from "react-router-dom";

const SiteStats = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <FaChartBar className="text-4xl text-yellow-400" />
            <h1 className="text-3xl font-extrabold">📊 Site Stats</h1>
          </div>
          <Link to="/admin-dashboard">
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
              ← Back to Dashboard
            </button>
          </Link>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          <TicketSalesChart />
        </div>
      </div>
    </div>
  );
};

export default SiteStats;
