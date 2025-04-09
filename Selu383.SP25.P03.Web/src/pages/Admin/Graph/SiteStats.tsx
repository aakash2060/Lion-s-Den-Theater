import { useEffect, useState } from "react";
import { FaChartBar } from "react-icons/fa";
import TicketSalesChart from "./TicketSalesChart";
import { Link } from "react-router-dom";
import axios from "axios";

interface SalesDataDto {
  movieTitle: string;
  theaterName: string;
  ticketsSold: number;
  totalRevenue: number;
}

interface Theater {
  id: number;
  name: string;
}

const SiteStats = () => {
  const [salesData, setSalesData] = useState<SalesDataDto[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheaterId, setSelectedTheaterId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTheaters = async () => {
      const res = await axios.get("/api/theaters");
      setTheaters(res.data);
    };
    fetchTheaters();
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      const res = await axios.get("/api/tickets/movie-ticket-sales", {
        params: {
          groupByDate: false,
          theaterId: selectedTheaterId || undefined,
        },
      });
      setSalesData(res.data);
    };
    fetchSales();
  }, [selectedTheaterId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
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

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-8">
          <TicketSalesChart />
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">🎬 Top Selling Movies</h2>
            <select
              className="bg-gray-700 text-white px-4 py-2 rounded"
              value={selectedTheaterId || ""}
              onChange={(e) =>
                setSelectedTheaterId(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">All Theaters</option>
              {theaters.map((theater) => (
                <option key={theater.id} value={theater.id}>
                  {theater.name}
                </option>
              ))}
            </select>
          </div>

          <table className="w-full text-left border-collapse mt-4">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-3 border border-gray-600">Movie Title</th>
                <th className="p-3 border border-gray-600">Theater</th>
                <th className="p-3 border border-gray-600">Tickets Sold</th>
                <th className="p-3 border border-gray-600">Total Revenue ($)</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale, index) => (
                <tr key={index} className="hover:bg-gray-700 transition">
                  <td className="p-3 border border-gray-700">{sale.movieTitle}</td>
                  <td className="p-3 border border-gray-700">{sale.theaterName}</td>
                  <td className="p-3 border border-gray-700">{sale.ticketsSold}</td>
                  <td className="p-3 border border-gray-700">
                    {sale.totalRevenue.toFixed(2)}
                  </td>
                </tr>
              ))}
              {salesData.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-3 text-gray-400">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SiteStats;
