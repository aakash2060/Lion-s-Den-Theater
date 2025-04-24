import React, { useEffect, useState } from "react";
import { FaTicketAlt, FaCalendarAlt, FaChair, FaUtensils, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";

const MyTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filters, setFilters] = useState({ movie: "", date: "", theater: "" });

  useEffect(() => {
    const stored = localStorage.getItem("userTickets");
    const parsed = stored ? JSON.parse(stored) : [];
    setTickets(parsed);
    setFiltered(parsed);
  }, []);

  useEffect(() => {
    const results = tickets.filter((ticket) => {
      const matchMovie = filters.movie === "" || ticket.showtime.movieTitle.toLowerCase().includes(filters.movie.toLowerCase());
      const matchDate = filters.date === "" || ticket.showtime.startTime.startsWith(filters.date);
      const matchTheater = filters.theater === "" || ticket.showtime.theaterName?.toLowerCase().includes(filters.theater.toLowerCase());
      return matchMovie && matchDate && matchTheater;
    });
    setFiltered(results);
  }, [filters, tickets]);

  const exportToPDF = (ticket: any) => {
    const doc = new jsPDF("p", "pt", "a4");
    const margin = 40;
    let y = margin;
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Lion's Den Theater", margin, y);
  
    y += 30;
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Movie Ticket Confirmation", margin, y);
  
    y += 30;
    doc.setFontSize(12);
    doc.text(`Ticket ID: #LD-${Math.floor(100000 + Math.random() * 900000)}`, margin, y);
    y += 20;
    doc.text(`Movie: ${ticket.showtime.movieTitle}`, margin, y);
    y += 20;
    doc.text(`Date: ${new Date(ticket.showtime.startTime).toLocaleDateString()}`, margin, y);
    y += 20;
    doc.text(`Time: ${new Date(ticket.showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, margin, y);
    y += 20;
    doc.text(`Theater: ${ticket.showtime.theaterName}`, margin, y);
    y += 20;
    doc.text(`Seats: ${ticket.selectedSeats.join(", ")}`, margin, y);
  
    const food = Object.values(ticket.foodCart || {})
      .map((item: any) => `${item.foodItem.name} x${item.quantity}`)
      .join(", ");
    if (food) {
      y += 20;
      doc.text(`Food: ${food}`, margin, y);
    }
  
    y += 30;
    doc.setDrawColor(180);
    doc.setLineWidth(0.5);
    doc.line(margin, y, 550, y);
  
    y += 30;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("This ticket must be presented at entry. Unauthorized duplication is prohibited.", margin, y);
    y += 15;
    doc.text("Enjoy your experience with Lion's Den Theater!", margin, y);
  
    // Save the file
    const fileName = `Ticket-${ticket.showtime.movieTitle.replace(/\s+/g, "-")}.pdf`;
    doc.save(fileName);
  };
  
  

  return (
    <div className="bg-gradient-to-br from-gray-950 to-black min-h-screen text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10 flex items-center justify-center gap-4">
        <FaTicketAlt className="text-red-500" />
        My Tickets
      </h1>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {["movie", "date", "theater"].map((field) => (
          <div key={field}>
            <input
              type={field === "date" ? "date" : "text"}
              placeholder={`Search by ${field}`}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none"
              value={(filters as any)[field]}
              onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
            />
          </div>
        ))}
      </div>

      {/* Ticket list */}
      <div className="space-y-8">
        {filtered.map((ticket, idx) => (
          <div key={idx} className="bg-gray-800 p-6 rounded-xl shadow-md flex flex-col md:flex-row md:items-center gap-6">
            <img src={ticket.showtime.moviePoster || "/placeholder.jpg"} alt={ticket.showtime.movieTitle} className="w-32 h-48 object-cover rounded-lg shadow" />

            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-semibold">{ticket.showtime.movieTitle}</h2>
              <p><FaCalendarAlt className="inline mr-2 text-red-500" /> {new Date(ticket.showtime.startTime).toLocaleString()}</p>
              <p><FaChair className="inline mr-2 text-yellow-500" /> Seats: {ticket.selectedSeats.join(", ")}</p>

              {ticket.foodCart && Object.keys(ticket.foodCart).length > 0 && (
                <>
                  <p className="text-green-400 font-bold"><FaUtensils className="inline mr-2" /> Food & Drinks</p>
                  <ul className="list-disc list-inside text-gray-300">
                    {Object.values(ticket.foodCart).map((item: any, i: number) => (
                      <li key={i}>{item.foodItem.name} × {item.quantity}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="flex flex-col items-center space-y-4">
              
              <button
                onClick={() => exportToPDF(ticket)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                <FaDownload className="inline mr-2" />
                Download
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <p>No tickets found... book your seat and come back 🎬</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;
