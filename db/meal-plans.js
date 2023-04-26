const client = require("./index");

// Get meal plan for the given week
async function getPlanByWeek(weekNumber) {
  try {
    await client.connect();
    const { rows } = await client.query(
      `
      SELECT meal_plans.*, meals.name, meals.description, meals.price, meals.image,
      json_agg(json_build_object('id', ingredients.id, 'name', ingredients.name, 'quantity', meal_ingredients.quantity, 'unit', ingredients.unit)) AS ingredients
      FROM meal_plans
      JOIN meals ON meal_plans.meal_id = meals.id
      JOIN meal_ingredients ON meals.id = meal_ingredients.meal_id
      JOIN ingredients ON meal_ingredients.ingredient_id = ingredients.id
      WHERE meal_plans.week_number = $1
      GROUP BY meal_plans.id, meals.id;
      `,
      [weekNumber]
    );
    await client.release();
    return rows;
  } catch (e) {
    console.error(e);
    throw new Error("Error getting weekly meal plan");
  }
}

// Create a new meal plan
async function createMealPlan(
  mealId,
  weekNumber,
  dayOfWeek,
  mealName,
  mealDescription
) {
  try {
    await client.connect();
    const { rows } = await client.query(
      `
        INSERT INTO meal_plans(meal_id, week_number, day_of_week, meal_name, meal_description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `,
      [mealId, weekNumber, dayOfWeek, mealName, mealDescription]
    );
    await client.release();
    return rows[0];
  } catch (e) {
    console.error(e);
    throw new Error("Error creating meal plan");
  }
}

// Add a meal to a plan
async function addMealToPlan(mealPlanId, mealId, tagId, ingredientQuantities) {
  try {
    await client.connect();
    const { rows } = await client.query(
      `
        INSERT INTO meal_plans(id, meal_id, tag_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO UPDATE
        SET meal_id = EXCLUDED.meal_id, tag_id = EXCLUDED.tag_id
        RETURNING *;
      `,
      [mealPlanId, mealId, tagId]
    );
    const values = ingredientQuantities
      .map((iq) => `($1, $2, $3, $4)`)
      .join(",");
    const args = ingredientQuantities.reduce(
      (acc, iq) => [...acc, mealPlanId, iq.ingredientId, iq.quantity, iq.unit],
      []
    );
    await client.query(
      `
        INSERT INTO meal_plan_ingredients(meal_plan_id, ingredient_id, quantity, unit)
        VALUES ${values}
        ON CONFLICT (meal_plan_id, ingredient_id) DO UPDATE
        SET quantity = EXCLUDED.quantity, unit = EXCLUDED.unit;
      `,
      args
    );
    await client.release();
    return rows[0];
  } catch (e) {
    console.error(e);
    throw new Error("Error adding meal to your plan");
  }
}

// Get a meal plan by its ID
async function getMealPlan(mealPlanId) {
  try {
    await client.connect();
    const { rows } = await client.query(
      `
      SELECT meal_plans.id, meals.name AS meal_name, meal_plan_ingredients.ingredient_id, ingredients.name AS ingredient_name, meal_plan_ingredients.quantity, meal_plan_ingredients.unit
      FROM meal_plans
      JOIN meals ON meal_plans.meal_id = meals.id
      JOIN meal_plan_ingredients ON meal_plans.id = meal_plan_ingredients.meal_plan_id
      JOIN ingredients ON meal_plan_ingredients.ingredient_id = ingredients.id
      WHERE meal_plans.id = $1;
      `,
      [mealPlanId]
    );
    console.log("Rows:", rows);
    await client.release();

    return rows;
  } catch (e) {
    console.error(e);
    return null;
  }
}
//removes a meal from a users plan
async function removeMealFromPlan(mealPlanId) {
  try {
    await client.connect();

    const {
      rows: [deletedMealPlan],
    } = await client.query(
      `
            DELETE FROM meal_plans
            WHERE id = $1
            RETURNING *;
          `,
      [mealPlanId]
    );

    await client.release();

    return deletedMealPlan;
  } catch (e) {
    console.error(e);
    throw new Error("Error removing meal from your plan");
  }
}

module.exports = {
  getPlanByWeek,
  createMealPlan,
  addMealToPlan,
  getMealPlan,
  removeMealFromPlan,
};
