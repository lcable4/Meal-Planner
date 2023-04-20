const express = require("express");
const mealIngredientsRouter = express.Router();
const { requireUser } = require("./utils");
const {
  addIngredientToMeal,
  removeIngredientFromMeal,
  getIngredientsByMeal,
  getMealsByIngredient,
} = require("../db/meal-ingredients");
const { getMealById } = require("../db/meals");
const { getIngredientById } = require("../db/ingredients");

mealIngredientsRouter.use((req, res, next) => {
  console.log("a request is being made to /meal-ingredients");

  next();
});

mealIngredientsRouter.get("/", (req, res, next) => {
  res.send("hello world");
  next();
});

mealIngredientsRouter.post(
  "/add-ingredient/:ingredientId/:mealId",
  async (req, res, next) => {
    try {
      if (req.admin) {
        const { ingredientId, mealId } = req.params;
        const checkMealId = await getMealById(mealId);
        if (!checkMealId) {
          next({
            name: "mealDoesNotExist",
            message: `a meal with id: ${mealId} does not exist`,
          });
        } else {
          const checkIngredientId = await getIngredientById(ingredientId);
          if (!checkIngredientId) {
            next({
              name: "ingredientDoesNotExist",
              message: `an ingredient with id: ${ingredientId} does not exist`,
            });
          } else {
            const mealIngredient = await addIngredientToMeal(
              mealId,
              ingredientId
            );
            console.log(mealIngredient, " mealIngredient!");

            if (mealIngredient) {
              res.send(mealIngredient);
            } else {
              next({
                name: "errorAddingIngredientToMeal",
                message: `error adding ingredientId: ${ingredientId} to mealId: ${mealId}`,
              });
            }
          }
        }
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      next(error);
    }
  }
);

mealIngredientsRouter.delete(
  "/delete/:ingredientId/:mealId",
  async (req, res, next) => {
    try {
      if (req.admin) {
        const { ingredientId, mealId } = req.params;

        const deletedMeal = await removeIngredientFromMeal(
          ingredientId,
          mealId
        );

        res.send(deletedMeal);
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      next(error);
    }
  }
);

mealIngredientsRouter.get(
  "/ingredients-by-meal/:mealId",
  async (req, res, next) => {
    try {
      const { mealId } = req.params;

      const ingredients = await getIngredientsByMeal(mealId);

      res.send(ingredients);
    } catch (error) {
      next(error);
    }
  }
);

mealIngredientsRouter.get(
  "/meals-by-ingredient/:ingredientId",
  async (req, res, next) => {
    try {
      const { ingredientId } = req.params;

      const meals = await getMealsByIngredient(ingredientId);

      res.send(meals);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = mealIngredientsRouter;
