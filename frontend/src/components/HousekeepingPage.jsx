// src/pages/HousekeepingPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const HousekeepingPage = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState({});
  const [message, setMessage] = useState("");

  // ✅ Fetch housekeeping services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/services/housekeeping");
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchServices();
  }, []);

  // ✅ Fetch active bookings for this user
useEffect(() => {
  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/bookings/user/${user.id}`
      );
      // filter for checked-in only
      setBookings(res.data.filter((b) => b.status === "checked-in"));
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };
  if (user?.id) fetchBookings();
}, [user]);

  // ✅ Handle checkbox toggle
  const toggleService = (service) => {
    if (selectedServices.find((s) => s._id === service._id)) {
      setSelectedServices(selectedServices.filter((s) => s._id !== service._id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const totalCost = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);


  // ✅ Submit housekeeping request
  const handleConfirm = async () => {
    if (!selectedBooking || selectedServices.length === 0) return;

    try {
      await axios.post("http://localhost:3000/api/service-requests", {
        userId: user.id,
        BookingId: selectedBooking,
        roomNumber: bookings.find(b => b._id === selectedBooking)?.roomNumber,
        serviceType: "Housekeeping",
        serviceTypeRef: "HousekeepingService",
        items: selectedServices.map((s) => ({
          serviceId: s._id,
          name: s.name,
          priceAtOrder: s.price,
          instructions: specialInstructions[s._id] || "",
        })),
        
        totalAmount: totalCost
      });

      setMessage("✅ Housekeeping request placed successfully!");
      setSelectedServices([]);
      setSpecialInstructions("");
      setSelectedBooking("");
    } catch (err) {
      console.error("Error placing request:", err);
      setMessage("❌ Failed to place housekeeping request.");
    }
  };

  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🧹 Housekeeping Services</h1>

      {/* Service List */}
      <div className="grid gap-4">
        {services.map((service) => (
          <label
            key={service._id}
            className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
          >
            <div>
              <h2 className="text-lg font-semibold">{service.name}</h2>
              <p className="text-sm text-gray-600">
                {service.description || "No description"}
              </p>
              <p className="text-sm font-medium">
                {service.price > 0 ? `৳${service.price}` : "Free"}
              </p>
            </div>
            <input
              type="checkbox"
              checked={!!selectedServices.find((s) => s._id === service._id)}
              onChange={() => toggleService(service)}
              className="w-5 h-5 accent-green-600"
            />
          </label>
        ))}
      </div>

{/* Cart Section */}
<div className="mt-6 border rounded-lg p-4">
  <h2 className="text-lg font-bold mb-3">🧺 Your Request</h2>
  {selectedServices.length === 0 ? (
    <p className="text-gray-500">No services selected.</p>
  ) : (
    <ul className="list-disc pl-5 space-y-4">
      {selectedServices.map((s) => (
        <li key={s._id}>
          <div className="mb-2">
            {s.name} – {s.price > 0 ? `৳${s.price}` : "Free"}
          </div>
          {/* Special Instructions for this service */}
          <textarea
            className="w-full border rounded-lg p-2"
            rows="2"
            placeholder={`Instructions for ${s.name}...`}
            value={specialInstructions[s._id] || ""}
            onChange={(e) =>
              setSpecialInstructions({
                ...specialInstructions,
                [s._id]: e.target.value,
              })
            }
          />
        </li>
      ))}
    </ul>
  )}
  <p className="mt-3 font-semibold">Total: ৳{totalCost}</p>
</div>



      {/* Room Selection */}
      <div className="mt-6">
        <label className="block font-medium mb-1">Deliver To Room</label>
        {bookings.length === 0 ? (
          <p className="text-red-500">⚠️ You are not checked into any room.</p>
        ) : (
          <select
            value={selectedBooking}
            onChange={(e) => setSelectedBooking(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">-- Select Room --</option>
            {bookings.map((b) => (
              <option key={b._id} value={b._id}>
                Room {b.roomNumber}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Confirm Button */}
      <button
        className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-400"
        disabled={selectedServices.length === 0 || !selectedBooking}
        onClick={handleConfirm}
      >
        Confirm Request
      </button>

      {/* Message */}
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default HousekeepingPage;
