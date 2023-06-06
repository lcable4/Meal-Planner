const express = require("express");
const mealPlansRouter = express.Router();
const {
  getPlanByWeek,
  createMealPlan,
  addMealToPlan,
  getMealPlan,
  removeMealFromPlan,
  getAllMealPlans,
} = require("../db/meal-plans");
const e = require("express");

//Get all meal plans created
mealPlansRouter.get("/", async (req, res, next) => {
  try {
    const mealPlans = await getAllMealPlans();
    res.json(mealPlans);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error getting meal plans" });
  }
});

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
    const mealPlanId = req.params.mealPlanId;
    const { mealId } = req.body;
    const updatedMealPlan = await addMealToPlan(mealPlanId, mealId);
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
mealPlansRouter.delete("/:mealPlanId/:mealId", async (req, res, next) => {
  const { mealPlanId, mealId } = req.params;
  try {
    const updatedMealPlan = await removeMealFromPlan(mealPlanId, mealId);
    if (updatedMealPlan) res.send(updatedMealPlan);
    else res.send("error at delete meal from meal-plan");
  } catch (e) {
    next(e);
  }
});

module.exports = mealPlansRouter;
