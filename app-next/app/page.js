"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Meal from "@/components/Meal/Meal";

export default function HomePage() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const res = await fetch("http://localhost:3005/api/meals");
        if (!res.ok) throw new Error("Failed to fetch meals");
        const data = await res.json();
        setMeals(data.slice(0, 4));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMeals();
  }, []);

  return (
    <div className="meals-container">
      <h1 className="meals-heading">Welcome to My Meal Sharing App!</h1>
      <h2 className="meals-heading">Discover some delicious meals</h2>

      {loading && <p>Loading meals...</p>}
      {error && <p>Error: {error}</p>}

      <div className="meals-grid">
        {meals.map((meal) => (
          <Meal key={meal.id} meal={meal} />
        ))}
      </div>

      <Link href="/meals">
        <button className="button" style={{ marginTop: "20px" }}>
          See All Meals
        </button>
      </Link>
    </div>
  );
}
