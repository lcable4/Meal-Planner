const client = require("./index");

const seedData = require("./seedData");
const seedTables = require("./seedTables");

const {
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  getUser,
  deactivateUser,
} = require("./users");

const { getCartByUserId, updateCartStatus } = require("./cart");

const {
  createIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deactivateIngredient,
  deleteIngredient,
} = require("./ingredients");

const {
  addIngredientToMeal,
  removeIngredientFromMeal,
  getIngredientsByMeal,
  getMealsByIngredient,
} = require("./meal-ingredients");

const {
  updateTag,
  deactivateTag,
  deleteTag,
  getAllTags,
  getTagById,
} = require("./tags");

const {
  createMeal,
  updateMeal,
  getAllMeals,
  getMealById,
  deleteMeal,
  deactivateMeal,
} = require("./meals");

const { removeTagFromMeal, getMealsByTag } = require("./meal-tags");

const {
  addMealToCart,
  removeMealFromCart,
  updateMealQuantity,
  getCartItemsByCartId,
  clearCart,
  clearGuestCart,
} = require("./cart-items");

const {
  createMealPlan,
  addMealToPlan,
  getMealPlan,
  getPlanByWeek,
  removeMealFromPlan,
  printMealPlan,
} = require("./meal-plans");

async function createEmptyMealPlans() {
  try {
    await client.connect();

    // Create two empty meal plans for week 1 and week 2
    const weekNumbers = [1, 2];

    for (const weekNumber of weekNumbers) {
      const { rows: mealPlan } = await client.query(
        `
          INSERT INTO meal_plans (week_number)
          VALUES ($1)
          RETURNING *;
        `,
        [weekNumber]
      );

      console.log(`Empty meal plan created for week ${weekNumber}:`, mealPlan);
    }

    await client.release();
    console.log("Finished creating meal plans!");
  } catch (e) {
    console.error(e);
    throw new Error("Error creating empty meal plans");
  }
}

async function addMeals() {
  try {
    console.log("Adding meals to meal plan 1");
    await addMealToPlan(1, 1, "Monday");
    await addMealToPlan(1, 2, "Tuesday");
    await addMealToPlan(1, 3, "Wednesday");
    await addMealToPlan(1, 4, "Thursday");
    await addMealToPlan(1, 5, "Friday");
    await addMealToPlan(1, 6, "Saturday");
    console.log("Adding meals to meal plan 2");
    await addMealToPlan(2, 1, "Monday");
    await addMealToPlan(2, 2, "Tuesday");
    await addMealToPlan(2, 3, "Wednesday");
    await addMealToPlan(2, 4, "Thursday");
    await addMealToPlan(2, 5, "Friday");
    await addMealToPlan(2, 6, "Saturday");
  } catch (error) {
    console.log(error);
  }
}

async function getPlan() {
  try {
    console.log("meals on meal plan 1");
    await printMealPlan(1);
  } catch (error) {
    console.log(error);
  }
}

async function rebuildDB() {
  await seedTables.dropTables();
  await seedTables.createTables();
  await seedData.createInitialUsers();
  await seedData.createAdminUsers();
  await seedData.createInitialTags();
  await seedData.createInitialCart();
  const ingredients = await seedData.createInitialIngredients();
  await seedData.createInitialMeals(ingredients);
  await createEmptyMealPlans();
  await addMeals();
}

rebuildDB();
