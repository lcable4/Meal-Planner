const client = require("./index");

//creates a new meal plan for a user
async function createMealPlan(userId) {
  try {
    await client.connect();

    // Insert a new meal plan for the specified user
    const {
      rows: [mealPlan],
    } = await client.query(
      `
          INSERT INTO meal_plans(user_id)
          VALUES ($1)
          RETURNING *;
        `,
      [userId]
    );

    await client.release();

    return mealPlan;
  } catch (e) {
    console.error(e);
    throw new Error("Error creating meal plan");
  }
}

async function addMealToPlan(mealId, tagId, ingredientQuantities) {
  try {
    await client.connect();

    // First insert the meal and tag into the meal_plans table
    const {
      rows: [meal_plan],
    } = await client.query(
      `
          INSERT INTO meal_plans(meal_id, tag_id)
          VALUES ($1, $2)
          ON CONFLICT(meal_id, tag_id) DO UPDATE
          SET meal_id = EXCLUDED.meal_id
          RETURNING *;
        `,
      [mealId, tagId]
    );

    // Next, insert the ingredient quantities into the meal_plan_ingredients table
    const values = ingredientQuantities.map((iq) => `($1, $2, $3)`).join(",");
    const args = ingredientQuantities.reduce(
      (acc, iq) => [...acc, meal_plan.id, iq.ingredientId, iq.quantity],
      []
    );
    await client.query(
      `
          INSERT INTO meal_plan_ingredients(meal_plan_id, ingredient_id, quantity)
          VALUES ${values}
          ON CONFLICT(meal_plan_id, ingredient_id) DO UPDATE
          SET quantity = EXCLUDED.quantity;
        `,
      args
    );

    await client.release();

    return meal_plan;
  } catch (e) {
    console.error(e);
    throw new Error("Error adding meal to your plan");
  }
}

//gets a meal plan that matches the id
async function getMealPlan(mealPlanId) {
  try {
    await client.connect();

    const {
      rows: [meal_plan],
    } = await client.query(
      `
            SELECT meal_plans.id, meals.name AS meal_name, tags.name AS tag_name, meal_plan_ingredients.ingredient_id, ingredients.name AS ingredient_name, meal_plan_ingredients.quantity
            FROM meal_plans
            JOIN meals ON meal_plans.meal_id = meals.id
            JOIN tags ON meal_plans.tag_id = tags.id
            JOIN meal_plan_ingredients ON meal_plans.id = meal_plan_ingredients.meal_plan_id
            JOIN ingredients ON meal_plan_ingredients.ingredient_id = ingredients.id
            WHERE meal_plans.id = $1;
          `,
      [mealPlanId]
    );

    await client.release();

    return meal_plan;
  } catch (e) {
    console.error(e);
    throw new Error("Error getting meal plan");
  }
}

//retrieves all meal plans for a given user ID
async function getMealPlanByUser(userId) {
  try {
    await client.connect();
    const { rows: mealPlans } = await client.query(
      `
          SELECT * FROM meal_plans
          WHERE user_id = $1
        `,
      [userId]
    );
    await client.release();
    return mealPlans;
  } catch (err) {
    console.error(err);
    throw new Error("Error retrieving meal plans for user");
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
  createMealPlan,
  addMealToPlan,
  getMealPlan,
  getMealPlanByUser,
  removeMealFromPlan,
};
