import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesData {
  date: string; // Format: 'YYYY-MM-DD'
  ticketsSold: number;
  totalRevenue: number;
}

const TicketSalesChart = () => {
  const [data, setData] = useState<SalesData[]>([]);
  const [overview, setOverview] = useState<{ totalTicketsSold: number; totalRevenue: number }>({
    totalTicketsSold: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetch('/api/tickets/sales')
      .then((res) => res.json())
      .then((rawData) => {
        const today = new Date();
        const isFirstDay = today.getDate() === 1;

        const referenceDate = isFirstDay
          ? new Date(today.getFullYear(), today.getMonth() - 1, 1)
          : new Date(today.getFullYear(), today.getMonth(), 1);

        const groupedData: { [key: string]: { ticketsSold: number; totalRevenue: number } } = {};
        let totalTicketsSold = 0;
        let totalRevenue = 0;

        rawData.forEach((item: any) => {
          const date = new Date(item.date);
          if (date >= referenceDate && date <= today) {
            const dateKey = date.toISOString().split('T')[0];

            if (!groupedData[dateKey]) {
              groupedData[dateKey] = { ticketsSold: 0, totalRevenue: 0 };
            }

            groupedData[dateKey].ticketsSold += item.ticketsSold;
            groupedData[dateKey].totalRevenue += item.totalRevenue;

            // Track total tickets sold and revenue
            totalTicketsSold += item.ticketsSold;
            totalRevenue += item.totalRevenue;
          }
        });

        const chartData: SalesData[] = [];

        const startDate = new Date(referenceDate);
        while (startDate <= today) {
          const dateKey = startDate.toISOString().split('T')[0];
          chartData.push({
            date: dateKey,
            ticketsSold: groupedData[dateKey]?.ticketsSold || 0,
            totalRevenue: groupedData[dateKey]?.totalRevenue || 0,
          });
          startDate.setDate(startDate.getDate() + 1);
        }

        // Update overview
        setOverview({
          totalTicketsSold,
          totalRevenue,
        });

        setData(chartData);
      })
      .catch((err) => console.error('Error loading chart data:', err));
  }, []);

  // Function to format the revenue with commas
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-white">Ticket Sales Overview</h2>

      {/* Overview Section */}
      <div className="mb-4 text-white">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total Tickets Sold: </span>
          <span>{overview.totalTicketsSold}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span>Total Revenue: </span>
          {/* Displaying formatted revenue */}
          <span>{formatCurrency(overview.totalRevenue)}</span>
        </div>
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ dy: 10 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ticketsSold" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="totalRevenue" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TicketSalesChart;
