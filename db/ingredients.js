const client = require("./index");
async function createIngredient(name, quantity, unit) {
  //creates an ingredient with the given name, quantity, and unit
  try {
    await client.connect();

    const { rows } = await client.query(
      `
          SELECT * FROM ingredients
          WHERE name = ($1);
          `,
      [name]
    );
    if (rows.length > 0) {
      console.log(`Ingredient with name "${name}" already exists`);
      return;
    }
    const { rows: ingredient } = await client.query(
      `
              INSERT INTO ingredients(name, quantity, unit)
              VALUES ($1, $2, $3)
              RETURNING *
              `,
      [name, quantity, unit]
    );
    await client.release();
    return ingredient;
    //returns the newly created ingredient
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getAllIngredients() {
  //gets all ingredients from the database
  try {
    await client.connect();

    const { rows: ingredients } = await client.query(`
            SELECT * FROM ingredients
        `);

    await client.release();
    return ingredients;
    //returns an array of all ingredients
  } catch (e) {
    console.error(e);
  }
}

async function getIngredientById(ingredientId) {
  //gets all the info from a specific ingredient based on the given id
  try {
    await client.connect();

    const {
      rows: [ingredient],
    } =
      // selects all information from ingredients where the id is equal to $1
      await client.query(
        ` 
          SELECT *
          FROM ingredients
          WHERE id = $1;
        `,
        [ingredientId]
      );

    await client.release();
    return ingredient;
    // returns all the ingredient info from a specific ingredient based on the id its given
  } catch (e) {
    console.error(e);
  }
}

//updates an ingredient based on the given ingredientId and fields
async function updateIngredient({ ingredientId, name, quantity, unit }) {
  try {
    await client.connect();

    const {
      rows: [ingredient],
    } = await client.query(
      `
          UPDATE ingredients
          SET name = $1, quantity = $2, unit = $3
          WHERE id = $4
          RETURNING *;
      `,
      [name, quantity, unit, ingredientId]
    );

    await client.release();
    return ingredient;
    //returns the updated ingredient
  } catch (e) {
    console.error(e);
  }
}

async function deactivateIngredient(ingredientId) {
  //switches an ingredient from active to inactive so that it won't display
  try {
    await client.connect();

    const { rowCount } = await client.query(
      `
      UPDATE ingredients
      SET active = false
      WHERE id=$1;
      `,
      [ingredientId]
    );

    await client.release();
    return rowCount;
    //returns the deactivated ingredient back
  } catch (e) {
    console.error(e);
  }
}

async function deleteIngredient(ingredientId) {
  //deletes an ingredient based on the ingredientId given
  try {
    await client.connect();

    const {
      rows: [ingredient],
    } = await client.query(
      `
         DELETE FROM ingredients
         WHERE id=$1
         RETURNING *;
        `,
      [ingredientId]
    );

    await client.release();

    return ingredient;
    //returns all ingredients minus the one deleted
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  createIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deactivateIngredient,
  deleteIngredient,
};
