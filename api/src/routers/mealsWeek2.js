import express from "express";
import knex from "../database_client.js";

const meals = express.Router();

const routes = [
  { route1: "/my-meals" }, // This is the GET route to get all meals from the database
  { route2: "/my-meals" }, // This is the POST route to add new meal to the database
  { route3: "/my-meals/:id" }, // This is the GET route to get meal from the database using id
  { route4: "/my-meals/:id" }, // This is the PUT route to update meal in the database using id
  { route5: "/my-meals/:id" }, // This is the DELETE route to delete meal from the database using id
];

// This is a base route to say Hello and show the routes available in the MEALS Table.
meals.get("/", (req, res) => {
  res.json({
    message: "Hello! This is the MEAL SHARING APP",
    routes: routes,
  });
});

// This is the GET route (localhost:3005/api/meals/my-meals) to get all meals from the database.
meals.get("/my-meals", async (req, res) => {
  try {
    const meals = await knex("meal").select("*").orderBy("id", "asc");
    res.json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// This is the Post route (localhost:3005/api/meals/my-meals) to add new meal to the database.
meals.post("/my-meals", async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      when,
      max_reservations,
      price,
      created_date,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !when ||
      !max_reservations ||
      !price ||
      !created_date
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (typeof max_reservations !== "number" || typeof price !== "number") {
      return res
        .status(400)
        .json({ error: "max_reservations and price must be numbers" });
    }

    if (max_reservations <= 0 || price <= 0) {
      return res
        .status(400)
        .json({ error: "max_reservations and price must be greater than 0" });
    }

    if (new Date(when) <= new Date()) {
      return res.status(400).json({ error: "when must be a future date" });
    }

    const [newMealId] = await knex("meal").insert({
      title,
      description,
      location,
      when,
      max_reservations,
      price,
      created_date,
    });

    const newMeal = await knex("meal").where({ id: newMealId }).first();

    res.status(201).json({
      message: "Record added successfully",
      Meal: newMeal,
    });
  } catch (error) {
    console.error("Error creating meal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Example of the body to be sent in the POST request to add new MEAL to the database
// {
//   "title": "LAMB MEAL",
//   "description": "Enjoy fresh LAMB Meal with friends!",
//   "location": "Tokyo",
//   "when": "2025-06-15T19:00:00",
//   "max_reservations": 20,
//   "price": 75.5,
//   "created_date": "2025-05-22T12:00:00"
// }

// This is the GET route (localhost:3005/api/meals/my-meals/:id) to get meal from the database using id.
meals.get("/my-meals/:id", async (req, res) => {
  try {
    const mealId = parseInt(req.params.id, 10);

    if (isNaN(mealId)) {
      return res.status(400).json({ error: "Invalid meal ID" });
    }

    const meal = await knex("meal").where({ id: mealId }).first();

    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.json(meal);
  } catch (error) {
    console.error("Error fetching meal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// This is the PUT route (localhost:3005/api/meals/my-meals/:id) to update meal in the database using id.
meals.put("/my-meals/:id", async (req, res) => {
  try {
    const mealId = parseInt(req.params.id, 10);
    const { title, description, location, when, max_reservations, price } =
      req.body;

    if (isNaN(mealId)) {
      return res.status(400).json({ error: "Invalid meal ID" });
    }

    if (
      !title ||
      !description ||
      !location ||
      !when ||
      !max_reservations ||
      !price
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (typeof max_reservations !== "number" || typeof price !== "number") {
      return res
        .status(400)
        .json({ error: "max_reservations and price must be numbers" });
    }

    if (max_reservations <= 0 || price <= 0) {
      return res
        .status(400)
        .json({ error: "max_reservations and price must be greater than 0" });
    }

    if (new Date(when) <= new Date()) {
      return res.status(400).json({ error: "when must be a future date" });
    }

    const updatedMeal = await knex("meal").where({ id: mealId }).update({
      title,
      description,
      location,
      when,
      max_reservations,
      price,
    });

    if (!updatedMeal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    const meal = await knex("meal").where({ id: mealId }).first();
    res.json(meal);
  } catch (error) {
    console.error("Error updating meal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// This is the DELETE route (localhost:3005/api/meals/my-meals/:id) to delete meal from the database using id.
meals.delete("/my-meals/:id", async (req, res) => {
  try {
    const mealId = parseInt(req.params.id, 10);

    if (isNaN(mealId)) {
      return res.status(400).json({ error: "Invalid meal ID" });
    }

    const mealToDelete = await knex("meal").where({ id: mealId }).first();

    if (!mealToDelete) {
      return res.status(404).json({ error: "Meal not found" });
    }

    await knex("meal").where({ id: mealId }).del();

    res.json({
      message: `Meal with ID ${mealId} deleted successfully`,
      deletedMeal: mealToDelete,
    });
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default meals;

// I Tried and Run All Routes and they are working fine.
