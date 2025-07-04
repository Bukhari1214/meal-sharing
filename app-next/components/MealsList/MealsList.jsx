"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Meal from "../Meal/Meal";

const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:3005/api/meals");
        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }
        const data = await response.json();
        setMeals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (loading) {
    return <p className="meals-message">Loading meals...</p>;
  }

  if (error) {
    return (
      <p className="meals-error">
        <strong>Error:</strong> {error}
        <br />
        Please check your network connection or API server.
      </p>
    );
  }

  if (meals.length === 0) {
    return <p className="meals-message">No meals to display.</p>;
  }

  return (
    <div className="meals-container">
      <h1 className="meals-heading">All Meals</h1>
      <div className="meals-grid">
        {meals.map((meal) => (
          <Link key={meal.id} href={`/meals/${meal.id}`}>
            <Meal meal={meal} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MealsList;
