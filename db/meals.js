const client = require("./index");

async function createMeal({ name, description, price, image }) {
  try {
    await client.connect();

    const {
      rows: [meal],
    } = await client.query(
      `
        INSERT INTO meals(name, description, price, image)
        VALUES ($1, $2, $3, $4)
        RETURNING *;`,
      [name, description, price, image]
    );
    await client.release();
    return meal;
  } catch (e) {
    console.error(e);
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
        SELECT *
        FROM meals;
      `);

    await client.release();

    return meals;
  } catch (e) {
    console.error(e);
  }
}

async function getMealById(mealId) {
  try {
    await client.connect();
    const {
      rows: [meal],
    } = await client.query(
      `
        SELECT *
        FROM meals
        WHERE id=$1;
        `,
      [mealId]
    );

    await client.release();

    return meal;
  } catch (e) {
    console.error(e);
  }
}

//deletes a car based on the carId passed in
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
  //getMealsByHubLocation,
  deleteMeal,
  //getMealsByTag,
  deactivateMeal,
};
