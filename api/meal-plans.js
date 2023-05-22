const express = require("express");
const mealPlansRouter = express.Router();
const {
  getPlanByWeek,
  createMealPlan,
  addMealToPlan,
  getMealPlan,
  removeMealFromPlan,
} = require("../db/meal-plans");
const e = require("express");

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
    if (req.admin) {
      const { day_of_week, weekNumber, mealName, mealDescription } = req.body;
      const mealPlan = await createMealPlan(
        day_of_week,
        weekNumber,
        mealName,
        mealDescription
      );
      res.status(201).json(mealPlan);
    }
  } catch (e) {
    next(e);
  }
});

// Add a meal to a meal plan
mealPlansRouter.post("/:mealPlanId", async (req, res, next) => {
  try {
    if (req.admin) {
      const mealPlanId = req.params.mealPlanId;
      const { mealId, ingredients } = req.body;
      const updatedMealPlan = await addMealToPlan(
        mealPlanId,
        mealId,
        ingredients
      );
      res.json(updatedMealPlan);
    }
  } catch (e) {
    next(e);
  }
});

// Get details of a meal plan
mealPlansRouter.get("/:mealPlanId", async (req, res, next) => {
  try {
    if (req.admin) {
      const mealPlanId = req.params.mealPlanId;
      const mealPlan = await getMealPlan(mealPlanId);
      res.json(mealPlan);
    }
  } catch (e) {
    next(e);
  }
});

// Remove a meal from a meal plan
mealPlansRouter.delete("/", async (req, res, next) => {
  const { mealPlanId, mealId } = req.body;
  try {
    if (req.admin) {
      const updatedMealPlan = await removeMealFromPlan(mealPlanId, mealId);
      if (updatedMealPlan) res.send(updatedMealPlan);
      else res.send("error at delete meal from meal-plan");
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    next(e);
  }
});

module.exports = mealPlansRouter;
