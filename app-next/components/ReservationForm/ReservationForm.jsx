"use client";

import { useState } from "react";
import "./ReservationForm.css";

export default function ReservationForm({ meal, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!name || !phone || !email || guests < 1) {
      setError("Please fill all fields correctly.");
      return;
    }

    setReservationDetails({
      name,
      phone,
      email,
      guests,
    });

    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const reservationData = {
        meal_id: meal.id,
        contact_name: reservationDetails.name,
        contact_phonenumber: reservationDetails.phone,
        contact_email: reservationDetails.email,
        number_of_guests: parseInt(reservationDetails.guests),
        // removed created_date here, backend should handle it
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reservations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservationData),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to make reservation");
      }

      setSuccess(true);
      setShowConfirm(false);

      setName("");
      setPhone("");
      setEmail("");
      setGuests(1);

      setTimeout(() => {
        setSuccess(false);
        setReservationDetails(null);
        onClose();
      }, 2500);
    } catch (err) {
      setError(err.message);
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="popup-overlay">
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <h3 className="popup-title" style={{ color: "limegreen" }}>
            Reservation successful!
          </h3>
          <p>
            <strong>Name:</strong> {reservationDetails?.name}
          </p>
          <p>
            <strong>Phone:</strong> {reservationDetails?.phone}
          </p>
          <p>
            <strong>Email:</strong> {reservationDetails?.email}
          </p>
          <p>
            <strong>Guests:</strong> {reservationDetails?.guests}
          </p>
        </div>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="popup-overlay">
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <h1 className="popup-title">Confirm Your Reservation</h1>
          <p>
            <strong>Name:</strong> {reservationDetails.name}
          </p>
          <p>
            <strong>Phone:</strong> {reservationDetails.phone}
          </p>
          <p>
            <strong>Email:</strong> {reservationDetails.email}
          </p>
          <p>
            <strong>Guests:</strong> {reservationDetails.guests}
          </p>

          {error && <p className="error-text">{error}</p>}

          <div className="button-row">
            <button
              className="button"
              onClick={handleConfirmSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Confirm"}
            </button>
            <button
              className="button"
              onClick={() => setShowConfirm(false)}
              style={{ marginLeft: "1rem" }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="popup-title">Reserve For: {meal.title}</h3>

        <form onSubmit={handleFormSubmit}>
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

          <div className="reservation-buttons-container">
            <div className="button-row">
              <button className="button" type="submit">
                Reserve
              </button>
              <button className="button" type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
