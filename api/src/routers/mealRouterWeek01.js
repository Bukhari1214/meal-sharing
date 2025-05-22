import express from "express";
import knex from "../database_client.js";

const mealRouter = express.Router();

// This is a simple example of how to use Knex.js with Express.js
mealRouter.get("/", (req, res) => {
  const routes = [
    { route1: "/future-meals" },
    { route2: "/past-meals" },
    { route3: "/all-meals" },
    { route4: "/first-meal" },
    { route5: "/last-meal" },
  ];

  res.json({
    message: "Hello! This is the MEAL SHARING APP, HOMEWORK NODEJS WEEK 01",
    Routes: routes,
  });
});

// ROUTE TO GET FUTURE MEALS.
mealRouter.get("/future-meals", async (req, res) => {
  try {
    const future_meals = await knex("meal")
      .where("when", ">", new Date())
      .orderBy("when", "asc");
    res.json(future_meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ROUTE TO GET PAST MEALS.

mealRouter.get("/past-meals", async (req, res) => {
  try {
    const past_meals = await knex("meal")
      .where("when", "<", new Date())
      .orderBy("when", "asc");
    res.json(past_meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ROUTE TO GET ALL MEALS SORTED BY ID.
mealRouter.get("/all-meals", async (req, res) => {
  try {
    const all_meals = await knex("meal").select("*").orderBy("id", "asc");

    res.json(all_meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ROUTE to GET FIRST MEAL IN DB.
mealRouter.get("/first-meal", async (req, res) => {
  try {
    const first_meal = await knex("meal")
      .select("*")
      .orderBy("id", "asc")
      .limit(1);

    res.json(first_meal);
  } catch (error) {
    console.error("Error executing Knex query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ROUTE to GET LAST MEAL IN DB
mealRouter.get("/last-meal", async (req, res) => {
  try {
    const last_meal = await knex("meal")
      .select("*")
      .orderBy("id", "desc")
      .limit(1);

    res.json(last_meal);
  } catch (error) {
    console.error("Error executing Knex query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default mealRouter;
