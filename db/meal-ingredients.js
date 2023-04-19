const client = require("./index");

async function addIngredientToMeal(mealId, ingredientId) {
  try {
    await client.connect();

    const {
      rows: [meal_ingredient],
    } = await client.query(
      `
          INSERT INTO meal_ingredients("mealId", "ingredientId")
          VALUES ($1, $2)
          ON CONFLICT("mealId", "ingredientId") DO NOTHING
          RETURNING *;
        `,
      [mealId, ingredientId]
    );
    await client.release();

    return meal_ingredient;
  } catch (e) {
    console.error(e);
    throw new Error("Error adding ingredient");
  }
}

async function removeIngredientFromMeal(ingredientId, mealId) {
  try {
    await client.connect();

    const {
      rows: [ingredient],
    } = await client.query(
      `
      DELETE FROM meal_ingredients
      WHERE "ingredientId" = $1 AND "mealId" = $2
      RETURNING *;
      `,
      [ingredientId, mealId]
    );
    await client.release();

    return ingredient;
  } catch (error) {
    throw error;
  }
}

async function getIngredientsByMeal(mealId) {
  try {
    await client.connect();

    const { rows } = await client.query(
      `
            SELECT ingredients.*
            FROM ingredients
            JOIN meal_ingredients ON ingredients.id = meal_ingredients.ingredient_id
            WHERE meal_ingredients.meal_id = $1;
            `,
      [mealId]
    );
    await client.release();
    return rows;
  } catch (error) {
    console.error("Error in getIngredientsByMeal:", error);
    throw error;
  }
}
async function getMealsByIngredient(ingredientId) {
  try {
    await client.connect();
    const { rows } = await client.query(
      `
        SELECT *
        FROM meal_ingredients
        INNER JOIN meals
        ON meal_ingredients."mealId" = meals.id
        WHERE meal_ingredients."ingredientId" = $1;
        `,
      [ingredientId]
    );
    await client.release();
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addIngredientToMeal,
  removeIngredientFromMeal,
  getIngredientsByMeal,
  getMealsByIngredient,
};
