const express = require("express");
const mealsRouter = express.Router();
const {
  createMeal,
  getAllMeals,
  getMealById,
  deleteMeal,
  updateMeal,
} = require("../db/meals");

// Get /api/meals/:id
mealsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await getMealById(id);
  res.send(result);
});

// Get /api/meals
mealsRouter.get("/", async (req, res) => {
  const result = await getAllMeals();
  console.log(result, "result");
  res.send(result);
});

//Post /api/meals
mealsRouter.post("/", async (req, res, next) => {
  if (req.admin) {
    const { name, description, ingredients, servings, tags, image } = req.body;
    const data = {
      name,
      description,
      ingredients,
      servings,
      tags,
      image,
    };
    const post = await createMeal(data);
    if (post) {
      res.send(post);
    } else {
      next({ name: "Meal Error", message: "Error creating meals" });
    }
  } else {
    res.sendStatus(401);
  }
});

mealsRouter.patch("/:mealId", async (req, res, next) => {
  const mealId = req.body.mealId;
  const fields = req.body;
  console.log(mealId);
  try {
    if (req.admin) {
      const meal = await updateMeal({ mealId, ...fields });
      res.send(meal);
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    throw e;
  }
});

// Delete /api/
mealsRouter.delete("/:mealId", async (req, res, next) => {
  const { mealId } = req.body;

  try {
    if (req.admin) {
      const { id } = req.params;
      const routine = await getMealById(mealId);
      console.log(routine, "id log");
      const deletedMeal = await deleteMeal(mealId);
      res.send(deletedMeal);
    } else {
      res.sendStatus(401);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = mealsRouter;
