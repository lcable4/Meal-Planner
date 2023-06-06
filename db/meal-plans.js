const client = require("./index");

// Get all meal plans created
async function getAllMealPlans() {
  try {
    await client.connect();
    const { rows } = await client.query(`
      SELECT *
      FROM meal_plans
    `);
    return rows;
  } catch (error) {
    console.log(error);
    throw new Error("Error getting all meal plans");
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Get meal plan for the given week
async function getPlanByWeek(weekNumber) {
  try {
    await client.connect();
    const { rows } = await client.query(
      `
      SELECT 
        meal_plans.week_number, 
        json_agg(DISTINCT meals.id) AS meal_ids 
      FROM 
        meal_plans 
        JOIN unnest(meal_plans.meal_ids) AS meal_id ON true 
        JOIN meals ON meal_id = meals.id 
      WHERE 
        meal_plans.week_number = $1 
      GROUP BY 
        meal_plans.week_number;
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

// Get a meal plan by its ID
async function getMealPlan(mealPlanId) {
  try {
    await client.connect();
    const { rows } = await client.query(
      `
      SELECT meals.id AS meal_id, meals.name AS meal_name
      FROM meal_plans
      JOIN meal_plan_meals ON meal_plans.id = meal_plan_meals.meal_plan_id
      JOIN meals ON meal_plan_meals.meal_id = meals.id
      WHERE meal_plans.id = $1;

      `,
      [mealPlanId]
    );
    await client.release();

    return rows;
  } catch (e) {
    console.error(e);
    return null;
  }
}
// Create a new meal plan
async function createMealPlan(mealPlanId, weekNumber) {
  try {
    await client.connect();
    const { rows } = await client.query(
      `
        INSERT INTO meal_plans(mealPlanId, week_number )
        VALUES ($1, $2)
        RETURNING *;
      `,
      [mealPlanId, weekNumber]
    );
    await client.release();
    return rows[0];
  } catch (e) {
    console.error(e);
    throw new Error("Error creating meal plan");
  }
}
// Add a meal to a plan
async function addMealToPlan(mealPlanId, mealId) {
  try {
    await client.connect();

    const query = `
      INSERT INTO meal_plan_meals (meal_plan_id, meal_id)
      VALUES ($1, $2)
      RETURNING id;
    `;

    const result = await client.query(query, [mealPlanId, mealId]);
    const mealPlanMealId = result.rows[0].id;

    return mealPlanMealId;
  } catch (e) {
    console.error(e);
    throw new Error("Error adding meal to the plan");
  } finally {
    await client.release();
  }
}

// Remove a meal from a user's plan
async function removeMealFromPlan(mealPlanId, mealId) {
  try {
    await client.connect();

    const query = `
      DELETE FROM meal_plan_meals
      WHERE meal_plan_id = $1 AND meal_id = $2
      RETURNING *;
    `;

    const {
      rows: [deletedMealPlanMeal],
    } = await client.query(query, [mealPlanId, mealId]);

    await client.release();

    return deletedMealPlanMeal;
  } catch (e) {
    console.error(e);
    throw new Error("Error removing meal from the plan");
  }
}

async function printMealPlan(weekNumber) {
  try {
    const plan = await getPlanByWeek(weekNumber);
    console.log(`Meal Plan for Week ${weekNumber}:`);
    for (let meal of plan) {
      console.log(`- ${meal.name}: ${meal.description}`);
      console.log(
        `  Ingredients: ${meal.ingredients.map((i) => i.name).join(", ")}`
      );
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  getPlanByWeek,
  createMealPlan,
  addMealToPlan,
  getMealPlan,
  removeMealFromPlan,
  printMealPlan,
  getAllMealPlans,
};
