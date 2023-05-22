const client = require("./index");

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
      SELECT meal_plan_meals.meal_id, meals.name AS meal_name
      FROM meal_plans
      JOIN meal_plan_meals ON meal_plans.id = meal_plan_meals.meal_plan_id
      JOIN meals ON meal_plan_meals.meal_id = meals.id
      WHERE meal_plans.id = $1
      GROUP BY meal_plan_meals.meal_id, meals.name;
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
  const query = `
      INSERT INTO meal_plan_meals (meal_plan_id, meal_id)
      VALUES ($1, $2)
      RETURNING id;
    `;
  const result = await client.query(query, [mealPlanId, mealId]);
  const mealPlanMealId = result.rows[0].id;

  const mealPlan = await getMealPlan(mealPlanId);
  const mealIds = mealPlan.map((meal) => meal.meal_id);
  mealIds.push(mealId);

  const updateQuery = `
      UPDATE meal_plans
      SET meal_ids = $1
      WHERE id = $2;
    `;
  await client.query(updateQuery, [mealIds, mealPlanId]);

  return mealPlanMealId;
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
};
