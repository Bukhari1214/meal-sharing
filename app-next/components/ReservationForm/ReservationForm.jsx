"use client";

import { useState } from "react";
import "./ReservationForm.css";

export default function ReservationForm({ meal, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatDate = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace("T", " "); // "YYYY-MM-DD HH:MM:SS"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !phone || !email || guests < 1) {
      setError("Please fill all fields correctly.");
      return;
    }

    const reservationData = {
      meal_id: meal.id,
      contact_name: name,
      contact_phonenumber: phone,
      contact_email: email,
      number_of_guests: parseInt(guests),
      created_date: formatDate(), // ✅ Add this
    };

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3005/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to make reservation");
      }

      setSuccess("Reservation successful!");
      setName("");
      setPhone("");
      setEmail("");
      setGuests(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="reservation-form-title">Reserve for: {meal.title}</h3>

        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Phone Number
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Number of Guests
            <input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              required
            />
          </label>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Reservation"}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ marginLeft: "1rem" }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
