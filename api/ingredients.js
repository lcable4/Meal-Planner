const express = require("express");

const {
  createIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deactivateIngredient,
  deleteIngredient,
} = require("../db/ingredients");
const ingredientsRouter = express.Router();

//Post a new ingredient
//POST /api/ingredients/
ingredientsRouter.post("/", async (req, res, next) => {
  try {
    if (req.admin) {
      const { ingredientName } = req.body;
      const ingredient = await createIngredient(ingredientName);
      res.send(ingredient);
    } else {
      res.sendStatus(401);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//Get all ingredients
//GET /api/ingredients/
ingredientsRouter.get("/", async (req, res, next) => {
  try {
    const ingredients = await getAllIngredients();
    res.send(ingredients);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//Gets one ingredient by ID
//GET /api/ingredients/:id
ingredientsRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const ingredient = await getIngredientById(id);
    res.send(ingredient);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//Updates one ingredient by ID
//PATCH /api/ingredients/:id
ingredientsRouter.patch("/:id", async (req, res, next) => {
  try {
    if (req.admin) {
      const { id } = req.params;
      const { ingredientName } = req.body;
      const updatedIngredient = await updateIngredient({
        ingredientId: id,
        ingredientName,
      });
      res.send(updatedIngredient);
    } else {
      res.sendStatus(401);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//Deactivates an ingredient matching the ID
//PATCH /api/ingredients/deactivate/:id
ingredientsRouter.patch("/deactivate/:id", async (req, res, next) => {
  try {
    if (req.admin) {
      const { id } = req.params;
      const rowCount = await deactivateIngredient(id);
      if (rowCount === 1) {
        res
          .status(200)
          .json({ message: `Ingredient ${id} has been deactivated.` });
      } else {
        res.status(404).json({ message: `Ingredient ${id} not found.` });
      }
    } else {
      res.sendStatus(401);
    }
  } catch ({ name, message }) {
    res.status(500).json({ message: "Internal server error." });
    next({ name, message });
  }
});

//Deletes an ingredient matching the ID
//DELETE /api/ingredients/:id
ingredientsRouter.delete("/:id", async (req, res, next) => {
  try {
    if (req.admin) {
      const { id } = req.params;
      const deletedIngredient = await deleteIngredient(id);
      if (deletedIngredient) {
        res.status(200).json({ message: `Ingredient ${id} has been deleted.` });
      } else {
        res.status(404).json({ message: `Ingredient ${id} was not found` });
      }
    } else {
      res.sendStatus(401);
    }
  } catch ({ name, message }) {
    res.status(500).json({ message: "Internal server error." });
    next({ name, message });
  }
});

module.exports = ingredientsRouter;
