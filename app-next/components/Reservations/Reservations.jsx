"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./Reservations.css";
import ReservationForm from "../ReservationForm/ReservationForm.jsx";

export default function Reservations({ meal, onClose }) {
  const router = useRouter();

  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [errorReservations, setErrorReservations] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setLoadingReservations(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch reservations");
        return res.json();
      })
      .then((data) => {
        const filtered = data.filter(
          (reservation) => reservation.meal_id === meal.id
        );
        setReservations(filtered);
        setErrorReservations(null);
      })
      .catch((err) => setErrorReservations(err.message))
      .finally(() => setLoadingReservations(false));
  }, [meal.id]);

  const maxReservations = 5;
  const total = reservations.length;
  const remaining = Math.max(0, maxReservations - total);

  if (showForm) {
    return <ReservationForm meal={meal} onClose={() => setShowForm(false)} />;
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="reservations-title">
          Available Reservations for {meal.title}
        </h3>

        {loadingReservations ? (
          <p className="reservations-text">Loading reservations...</p>
        ) : errorReservations ? (
          <p className="reservations-text">Error: {errorReservations}</p>
        ) : (
          <>
            <p className="reservations-text">
              Total reservations for this meal: {total}
            </p>
            <p className="reservations-text">
              Remaining reservation slots: {remaining}
            </p>
          </>
        )}

        <div className="buttons-container">
          {total < maxReservations &&
            !loadingReservations &&
            !errorReservations && (
              <div className="button-row">
                <button className="button" onClick={() => setShowForm(true)}>
                  Make A Reservation
                </button>
              </div>
            )}
          <div className="button-row">
            <button className="button" onClick={onClose}>
              Close
            </button>
            <button className="button" onClick={() => router.push("/meals")}>
              Back to Meals List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
