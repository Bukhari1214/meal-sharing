import express from "express";
import knex from "../database_client.js";

const meals = express.Router();

// const routes = [
//   { route1: "/my-meals" }, // This is the GET route to get all meals from the database
//   { route2: "/my-meals" }, // This is the POST route to add new meal to the database
//   { route3: "/my-meals/:id" }, // This is the GET route to get meal from the database using id
//   { route4: "/my-meals/:id" }, // This is the PUT route to update meal in the database using id
//   { route5: "/my-meals/:id" }, // This is the DELETE route to delete meal from the database using id
// ];

// // This is a base route to say Hello and show the routes available in the MEALS Table.
// meals.get("/", (req, res) => {
//   res.json({
//     message: "Hello! This is the MEAL SHARING APP",
//     routes: routes,
//   });
// });

// This is the GET route (localhost:3005/api/meals) to get all meals from the database.
// APPLIED all query parameters as per asked in assignmentto this route
meals.get("/", async (req, res) => {
  try {
    const rawQuery = req.query;
    const allowedParams = [
      "maxprice",
      "availablereservations",
      "title",
      "dateafter",
      "datebefore",
      "limit",
      "sortkey",
      "sortdir",
    ];
    const normalizedQuery = {};

    for (const key in rawQuery) {
      if (Object.hasOwn(rawQuery, key)) {
        normalizedQuery[key.toLowerCase()] = rawQuery[key];
      }
    }

    const invalidParams = Object.keys(normalizedQuery).filter(
      (key) => !allowedParams.includes(key)
    );
    if (invalidParams.length > 0) {
      return res.status(400).json({
        error: `Invalid query parameter(s): ${invalidParams.join(", ")}`,
      });
    }

    const subQuery = knex("reservation")
      .select("meal_id")
      .count("* as reservation_count")
      .groupBy("meal_id");

    const query = knex("meal")
      .leftJoin(subQuery.as("r"), "meal.id", "r.meal_id")
      .select("meal.*")
      .select(knex.raw("COALESCE(r.reservation_count, 0) as reservation_count"))
      .orderBy("meal.id", "asc");

    // FOR api/meals?maxPrice=90

    if ("maxprice" in normalizedQuery) {
      const maxPrice = parseFloat(normalizedQuery.maxprice);
      if (isNaN(maxPrice)) {
        return res.status(400).json({ error: "Invalid maxPrice" });
      }
      query.where("meal.price", "<=", maxPrice);
    }

    // FOR api/meals?availableReservations=true
    if ("availablereservations" in normalizedQuery) {
      const value = normalizedQuery.availablereservations.toLowerCase();
      if (value === "true") {
        query.whereRaw(
          "meal.max_reservations > COALESCE(r.reservation_count, 0)"
        );
      } else {
        return res.status(400).json({
          error: `availableReservations must be 'true'; you entered: '${value}'`,
        });
      }
    }

    // FOR api/meals?title=beef karahi
    if ("title" in normalizedQuery) {
      const title = normalizedQuery.title.trim().toLowerCase();
      query.whereRaw("LOWER(meal.title) LIKE ?", [`%${title}%`]);
    }

    // FOR api/meals?dateAfter=2024-01-01
    if ("dateafter" in normalizedQuery) {
      const date = new Date(normalizedQuery.dateafter);
      if (isNaN(date.getTime())) {
        return res
          .status(400)
          .json({ error: "Invalid dateAfter format. Use YYYY-MM-DD" });
      }
      query.where("meal.when", ">", date);
    }

    //api/meals?dateBefore=2024-01-01
    if ("datebefore" in normalizedQuery) {
      const date = new Date(normalizedQuery.datebefore);
      if (isNaN(date.getTime())) {
        return res
          .status(400)
          .json({ error: "Invalid dateBefore format. Use YYYY-MM-DD" });
      }
      query.where("meal.when", "<", date);
    }

    // FOR api/meals?limit=10
    if ("limit" in normalizedQuery) {
      const limit = parseInt(normalizedQuery.limit, 10);
      if (isNaN(limit) || limit <= 0) {
        return res
          .status(400)
          .json({ error: "Invalid limit value. Must be a positive number." });
      }
      query.limit(limit);
    }

    // Sorting logic
    // Allowed sort keys and directions ASC/DESC
    // api/meals?sortkey=when
    const allowedSortKeys = ["when", "max_reservations", "price"];
    const allowedSortDirs = ["asc", "desc"];

    let sortKey = "meal.id";
    let sortDir = "asc";

    if ("sortkey" in normalizedQuery) {
      const key = normalizedQuery.sortkey.toLowerCase();
      if (!allowedSortKeys.includes(key)) {
        return res.status(400).json({
          error: `Invalid sortKey. Allowed keys: ${allowedSortKeys.join(", ")}`,
        });
      }
      sortKey = `meal.${key}`;
    }

    // api/meals?sortkey=when&sortdir=asc
    if ("sortdir" in normalizedQuery) {
      if (!("sortkey" in normalizedQuery)) {
        return res.status(400).json({
          error: "sortDir parameter requires sortKey to be provided as well",
        });
      }
      const dir = normalizedQuery.sortdir.toLowerCase();
      if (!allowedSortDirs.includes(dir)) {
        return res.status(400).json({
          error: `Invalid sortDir. Allowed values: ${allowedSortDirs.join(", ")}`,
        });
      }
      sortDir = dir;
    }

    query.clearOrder();
    query.orderBy(sortKey, sortDir);

    const meals = await query;
    res.json(meals);
  } catch (error) {
    console.error("Full error:", error.stack || error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// This is the Post route (localhost:3005/api/meals/my-meals) to add new meal to the database.
meals.post("/", async (req, res) => {
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
//   "when": "2025-05-22T12:00:00",
//   "max_reservations": 20,
//   "price": 75.5,
//   "created_date": "2025-05-22T12:00:00"
// }

// This is the GET route (localhost:3005/api/meals/my-meals/:id) to get meal from the database using id.
meals.get("/:id", async (req, res) => {
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
meals.put("/:id", async (req, res) => {
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
meals.delete("/:id", async (req, res) => {
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
