const client = require("./index");

async function createMeal(meal) {
  try {
    await client.connect();
    const { rows } = await client.query(
      `
      INSERT INTO meals(name, description, ingredients)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [meal.name, meal.description, JSON.stringify(meal.ingredients)]
    );

    const createdMeal = rows[0];
    await client.release();

    return createdMeal;
  } catch (e) {
    console.error(e);
    throw { name: "Meal Error", message: "Error creating meals" };
  }
}
//creates a string and sets the values of the updated fields using Object.keys
async function updateMeal({ mealId, ...fields }) {
  try {
    const setString = Object.keys(fields)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(", ");
    console.log(fields);
    await client.connect();

    const {
      rows: [meal],
    } = await client.query(
      `
        UPDATE meals
        SET ${setString}
        WHERE id=${mealId}
        RETURNING *;
      `,
      [...Object.values(fields)]
    );

    await client.release();

    return meal;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getAllMeals() {
  try {
    await client.connect();
    const { rows: meals } = await client.query(`
    SELECT meals.id, meals.name, meals.description, 
    json_agg(json_build_object('id', ingredients.id, 'name', ingredients.name, 'quantity', meal_ingredients.quantity, 'unit', ingredients.unit)) AS ingredients
    FROM meals
    JOIN meal_ingredients ON meals.id = meal_ingredients.meal_id
    JOIN ingredients ON meal_ingredients.ingredient_id = ingredients.id
    GROUP BY meals.id;
      `);

    const { rows: tags } = await client.query(`
      SELECT meals.id AS meal_id, tags.id, tags.name, tags.active
      FROM meals
      JOIN meal_tags ON meals.id = meal_tags."mealId"
      JOIN tags ON meal_tags."tagId" = tags.id;
      `);

    await client.release();

    meals.forEach((meal) => {
      meal.tags = tags.filter((tag) => tag.meal_id === meal.id);
    });

    return meals;
  } catch (e) {
    console.error(e);
  }
}
async function getMealById(mealId) {
  try {
    await client.connect();
    const { rows: meals } = await client.query(
      `
      SELECT meals.id, meals.name, meals.description,
        json_agg(json_build_object('id', ingredients.id, 'name', ingredients.name, 'quantity', meal_ingredients.quantity, 'unit', ingredients.unit)) AS ingredients
      FROM meals
      JOIN meal_ingredients ON meals.id = meal_ingredients.meal_id
      JOIN ingredients ON meal_ingredients.ingredient_id = ingredients.id
      WHERE meals.id = $1
      GROUP BY meals.id;
    `,
      [mealId]
    );

    const { rows: tags } = await client.query(
      `
      SELECT meals.id AS meal_id, tags.id, tags.name, tags.active
      FROM meals
      JOIN meal_tags ON meals.id = meal_tags."mealId"
      JOIN tags ON meal_tags."tagId" = tags.id
      WHERE meals.id = $1;
    `,
      [mealId]
    );

    await client.release();

    if (meals.length > 0) {
      const meal = meals[0];
      meal.tags = tags;
      return meal;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
  }
}

//deletes a meal based on the carId passed in
async function deleteMeal(mealId) {
  try {
    await client.connect();
    const {
      rows: [result],
    } = await client.query(
      `
        DELETE FROM meal_tags
        WHERE "mealId"=$1
        RETURNING *;
    `,
      [mealId]
    );
    const {
      rows: [meal],
    } = await client.query(
      `
         DELETE FROM meals
         WHERE id=$1
         RETURNING *;
        `,
      [mealId]
    );

    await client.release();

    return meal;
  } catch (e) {
    console.error(e);
  }
}

//this function will change the active tag from true to false in the cars table
async function deactivateMeal(mealId) {
  try {
    await client.connect();

    const {
      rows: [meal],
    } = await client.query(
      `
      UPDATE meals
      SET active = false
      WHERE id = $1
      RETURNING *;
      `,
      [mealId]
    );

    await client.release();
    return meal;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  createMeal,
  updateMeal,
  getAllMeals,
  getMealById,
  deleteMeal,
  deactivateMeal,
};
