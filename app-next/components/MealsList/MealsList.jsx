import React, { useEffect, useState } from "react";
import "./MealsList.css";

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

  return (
    <div className="meals-container">
      <h1 className="meals-heading">All Meals</h1>
      {loading && <p className="meals-message">Loading...</p>}
      {error && <p className="meals-error">Error: {error}</p>}
      <ul className="meals-list">
        {meals.map((meal) => (
          <li key={meal.id} className="meal-card">
            <h2 className="meal-title">{meal.title}</h2>
            <p className="meal-description">{meal.description}</p>
            <p className="meal-price">Price: ${meal.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealsList;
