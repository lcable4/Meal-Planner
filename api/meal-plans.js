const express = require("express");
const mealPlansRouter = express.Router();
const {
  getPlanByWeek,
  createMealPlan,
  addMealToPlan,
  getMealPlan,
  removeMealFromPlan,
} = require("../db/meal-plans");

// Get meal plan for a given week
mealPlansRouter.get("/week/:weekNumber", async (req, res, next) => {
  try {
    const weekNumber = req.params.weekNumber;
    const mealPlan = await getPlanByWeek(weekNumber);
    res.json(mealPlan);
  } catch (e) {
    next(e);
  }
});

// Create a new meal plan
mealPlansRouter.post("/", async (req, res, next) => {
  try {
    const { day_of_week, weekNumber, mealName, mealDescription } = req.body;
    const mealPlan = await createMealPlan(
      day_of_week,
      weekNumber,
      mealName,
      mealDescription
    );
    res.status(201).json(mealPlan);
  } catch (e) {
    next(e);
  }
});

// Add a meal to a meal plan
mealPlansRouter.post("/:mealPlanId/:mealId", async (req, res, next) => {
  try {
    const mealPlanId = req.params.mealPlanId;
    const { mealId, ingredients } = req.body;
    const updatedMealPlan = await addMealToPlan(
      mealPlanId,
      mealId,
      ingredients
    );
    res.json(updatedMealPlan);
  } catch (e) {
    next(e);
  }
});

// Get details of a meal plan
mealPlansRouter.get("/:mealPlanId", async (req, res, next) => {
  try {
    const mealPlanId = req.params.mealPlanId;
    const mealPlan = await getMealPlan(mealPlanId);
    res.json(mealPlan);
  } catch (e) {
    next(e);
  }
});

// Remove a meal from a meal plan
mealPlansRouter.delete("/:mealPlanId/meals/:mealId", async (req, res, next) => {
  try {
    const mealPlanId = req.params.mealPlanId;
    const mealId = req.params.mealId;
    const updatedMealPlan = await removeMealFromPlan(mealPlanId, mealId);
    res.json(updatedMealPlan);
  } catch (e) {
    next(e);
  }
});

module.exports = mealPlansRouter;
