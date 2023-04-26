const client = require("./index");

const {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  getUser,
  deactivateUser,
} = require("./users");

const { createCart, getCartByUserId, updateCartStatus } = require("./cart");

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
  createTag,
  updateTag,
  deactivateTag,
  deleteTag,
  getAllTags,
  getTagById,
} = require("./tags");

const { createAdmin } = require("./admin");

const {
  createMeal,
  updateMeal,
  getAllMeals,
  getMealById,
  deleteMeal,
  deactivateMeal,
} = require("./meals");

const {
  addTagToMeal,
  removeTagFromMeal,
  getTagsByMeal,
  getMealsByTag,
} = require("./meal-tags");

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
  getMealPlanByUser,
  removeMealFromPlan,
} = require("./meal-plans");

function getWeekNumber(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = day - firstDayOfYear.getDay() + 1;
  const weekNumber = Math.ceil(pastDaysOfYear / 7);
  return weekNumber;
}

async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.connect();
    await client.query(`
        DROP TABLE IF EXISTS guest_cart_items;
        DROP TABLE IF EXISTS cart_items;
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS guest_cart;
        DROP TABLE IF EXISTS meal_plan_ingredients;
        DROP TABLE IF EXISTS meal_plans ;
        DROP TABLE IF EXISTS monthly_plans;
        DROP TABLE IF EXISTS meal_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS meal_ingredients;
        DROP TABLE IF EXISTS meals ;
        DROP TABLE IF EXISTS ingredients;
        DROP TABLE IF EXISTS users ;
        DROP TABLE IF EXISTS guests;
        DROP TABLE IF EXISTS admins;
        `);
    console.log("Finished dropping tables!");
    await client.release();
  } catch (error) {
    console.log("Error when dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    await client.connect();
    console.log("Starting to build tables...");
    await client.query(`
        CREATE TABLE admins(
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) UNIQUE NOT NULL,
          active BOOLEAN DEFAULT TRUE,
          "isAdmin" BOOLEAN DEFAULT TRUE
        );
  
        CREATE TABLE users(
          id SERIAL PRIMARY KEY UNIQUE,
          email VARCHAR(255) UNIQUE NOT NULL,
          location VARCHAR(255),
          active BOOLEAN DEFAULT TRUE,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        );
        
        CREATE TABLE guests(
          id SERIAL PRIMARY KEY UNIQUE,
          name VARCHAR(255) NOT NULL
        );
        
        CREATE TABLE guest_cart(
          id SERIAL PRIMARY KEY UNIQUE,
          "guestId"  INTEGER REFERENCES guests(id) ON DELETE CASCADE,
          "isOrdered" BOOLEAN DEFAULT false
        );
        
  
        CREATE TABLE meals(
          id SERIAL PRIMARY KEY UNIQUE,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          ingredients TEXT NOT NULL,
          upvotes INTEGER,
          price INTEGER,
          active BOOLEAN DEFAULT TRUE,
          image VARCHAR(255),
          UNIQUE(id, name, description)
        );
        
          CREATE TABLE ingredients(
            id SERIAL PRIMARY KEY UNIQUE,
            name VARCHAR(255) UNIQUE NOT NULL,
            quantity INTEGER,
            unit VARCHAR(255)
          );
          
          CREATE TABLE meal_ingredients(
            meal_id INTEGER REFERENCES meals(id),
            ingredient_id INTEGER REFERENCES ingredients(id),
            quantity INTEGER
          );
        CREATE TABLE tags(
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          active BOOLEAN DEFAULT TRUE
        );
        
        CREATE TABLE meal_tags(
          id SERIAL PRIMARY KEY,
          "mealId" INTEGER REFERENCES meals(id) ON DELETE CASCADE,
          "tagId" INTEGER REFERENCES tags(id),
          UNIQUE("mealId", "tagId")
        );
        
        CREATE TABLE meal_plans (
        id SERIAL PRIMARY KEY,
        meal_id INTEGER,
        week_number INTEGER NOT NULL,
        day_of_week VARCHAR(255) NOT NULL,
        meal_name VARCHAR(255),
        meal_description TEXT,
        UNIQUE(meal_id, week_number, day_of_week, meal_name, meal_description),
        FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
        );
        
        CREATE TABLE meal_plan_ingredients (
          meal_plan_id INTEGER REFERENCES meal_plans(id),
          ingredient_id INTEGER REFERENCES ingredients(id),
          quantity INTEGER,
          unit VARCHAR(255),
          PRIMARY KEY(meal_plan_id, ingredient_id)
        );
        CREATE TABLE monthly_plans (
          id SERIAL PRIMARY KEY,
          month_number INTEGER NOT NULL,
          week_number INTEGER NOT NULL,
          year INTEGER NOT NULL,
          UNIQUE(month_number, week_number, year)
        );
        CREATE TABLE cart(
          id SERIAL PRIMARY KEY,
          "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
          "isOrdered" BOOLEAN DEFAULT false
        );
        
        CREATE TABLE cart_items(
          id SERIAL PRIMARY KEY,
          "cartId" INTEGER REFERENCES cart(id) ON DELETE CASCADE,
          "mealId" INTEGER REFERENCES meals(id) ON DELETE CASCADE,
          price INTEGER,
          quantity INTEGER NOT NULL DEFAULT 1
        );
  
        CREATE TABLE guest_cart_items(
          id SERIAL PRIMARY KEY UNIQUE,
          "guestCartId" INTEGER REFERENCES guest_cart(id) ON DELETE CASCADE,
          "mealId" INTEGER REFERENCES meals(id) ON DELETE CASCADE,
          price INTEGER,
          quantity INTEGER NOT NULL DEFAULT 1
        );
        
        `);
    console.log("Finished building tables!");
    client.release();
  } catch (error) {
    console.log("Error when building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  console.log("Starting to create users...");
  try {
    const usersToCreate = [
      {
        username: "albert",
        password: "bertie99",
        email: "albert@gmail.com",
      },
      {
        username: "sandra",
        password: "sandra123",
        email: "sandra@gmail.com",
      },
      {
        username: "glamgal",
        password: "glamgal123",
        email: "glamgal@gmail.com",
      },
    ];
    const users = [];
    for (let i = 0; i < usersToCreate.length; i++) {
      users.push(await createUser(usersToCreate[i]));
    }
    console.log("Users created:");
    console.log(users);
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createAdminUsers() {
  console.log("Starting to create admin users...");
  const userToCreate = [{ username: "logan", password: "password" }];
  try {
    const users = [];
    for (let i = 0; i < userToCreate.length; i++) {
      users.push(await createAdmin(userToCreate[i]));
    }
    console.log("Admins created", users);
    console.log("Finished creating admin users!");
  } catch (error) {
    console.error("Error creating admin users");
    throw error;
  }
}

async function createInitialTags() {
  console.log("Starting to create tags...");
  try {
    const tagsToCreate = [
      "American",
      "Asian",
      "Mexican",
      "Italian",
      "Gluten Free",
      "South Western",
      "Dessert",
      "Breakfast",
      "Brunch",
      "Lunch",
      "Dinner",
      "Drinks",
    ];
    const tags = [];

    for (let i = 0; i < tagsToCreate.length; i++) {
      tags.push(await createTag(tagsToCreate[i]));
    }

    console.log("Tags created:");
    console.log(tags);
    console.log("Finished creating tags!");
  } catch (error) {
    console.error("Error creating tags!");
    throw error;
  }
}

async function createInitialCart() {
  console.log("Creating initial cart");
  try {
    const cartToCreate = [1, 2];
    const carts = [];

    for (let i = 0; i < cartToCreate.length; i++) {
      carts.push(await createCart(cartToCreate[i]));
    }
    console.log("Carts created:");
    console.log(carts);
    console.log("Finished creating carts!");
  } catch (error) {
    console.log(error);
  }
}

async function createInitialIngredients() {
  console.log("Starting to create ingredients...");
  try {
    const ingredientsToCreate = [
      { name: "Chicken Breast", quantity: 1, unit: "pound" },
      { name: "Salmon", quantity: 1, unit: "pound" },
      { name: "Garlic", quantity: 2, unit: "cloves" },
      { name: "Beef", quantity: 1, unit: "pound" },
      { name: "Bacon", quantity: 8, unit: "slices" },
      { name: "Potatoes", quantity: 2, unit: "lbs" },
      { name: "Onions", quantity: 1, unit: "medium" },
      { name: "Bell Pepper", quantity: 1, unit: "medium" },
      { name: "Green Chiles", quantity: 1, unit: "can" },
      { name: "Spinach", quantity: 1, unit: "cup" },
      { name: "Eggs", quantity: 4, unit: "" },
      { name: "Sea Salt", quantity: 1, unit: "tsp" },
      { name: "Pepper", quantity: 1, unit: "tsp" },
      { name: "Avocado", quantity: 1, unit: "" },
      { name: "Water", quantity: 1, unit: "cup" },
      { name: "Ginger", quantity: 1, unit: "tbsp" },
      { name: "Orange Juice", quantity: 1, unit: "cup" },
      { name: "Lemon Juice", quantity: 1, unit: "tbsp" },
      { name: "Lime Juice", quantity: 1, unit: "tbsp" },
      { name: "Baking Soda", quantity: 1, unit: "tsp" },
      { name: "Maple Syrup", quantity: 2, unit: "tbsp" },
      { name: "Honey", quantity: 1, unit: "tbsp" },
      { name: "Coffee", quantity: 1, unit: "cup" },
      { name: "Egg Yolks", quantity: 4, unit: "" },
      { name: "Butter", quantity: 1, unit: "cup" },
      { name: "Strawberries", quantity: 1, unit: "cup" },
      { name: "Whole Milk Cottage Cheese", quantity: 1, unit: "cup" },
      { name: "Sugar", quantity: 1, unit: "cup" },
      { name: "Cream", quantity: 1, unit: "cup" },
      { name: "Cottage Cheese", quantity: 1, unit: "cup" },
      { name: "Olive Oil", quantity: 2, unit: "tbsp" },
      { name: "Lemon Zest", quantity: 1, unit: "tsp" },
      { name: "Garlic Powder", quantity: 1, unit: "tsp" },
      { name: "Lemon", quantity: 1, unit: "" },
      { name: "Parsley", quantity: 1, unit: "tbsp" },
      { name: "Asparagus", quantity: 1, unit: "lb" },
      { name: "Grated Parmesan", quantity: 1, unit: "cup" },
      { name: "Broccoli", quantity: 1, unit: "lb" },
      { name: "Brown Rice", quantity: 1, unit: "cup" },
      { name: "Soy Sauce", quantity: 1, unit: "tbsp" },
      { name: "Sesame Seeds", quantity: 1, unit: "tbsp" },
    ];
    const createdIngredients = [];

    for (let i = 0; i < ingredientsToCreate.length; i++) {
      const ingredient = ingredientsToCreate[i];
      const { name, quantity, unit } = ingredient;
      const ingredientJSON = JSON.stringify(ingredient);
      console.log(ingredientJSON, "JSON LOG");

      const {
        rows: [createdIngredient],
      } = await client.query(
        `
          INSERT INTO ingredients(name, quantity, unit)
          VALUES ($1, $2, $3)
          RETURNING *;
        `,
        [name, quantity, unit]
      );

      createdIngredients.push(createdIngredient);
      console.log("ingredient:", createdIngredient);
    }
    console.log("ingredients created:", createdIngredients);
    console.log("Finished creating ingredients!");
    return createdIngredients;
  } catch (error) {
    console.error("Error creating ingredients!");
    throw error;
  }
}
async function createInitialMeals(ingredients) {
  console.log("Starting to create meals...");

  try {
    const mealsToCreate = [
      {
        name: "Stir-Fried Ginger Chicken with Vegetables",
        description:
          "Cook sliced chicken breast in a pan with ginger, garlic, soy sauce, and sesame oil. Add sliced vegetables like bell peppers, carrots, and snow peas and stir-fry until tender. Serve over brown rice.",
        ingredients: [
          { id: 1, name: "Chicken Breast", quantity: 1, unit: "pound" },
          { id: 39, name: "Soy Sauce", quantity: 1, unit: "tbsp" },
          { id: 40, name: "Sesame Seeds", quantity: 1, unit: "tbsp" },
          { id: 8, name: "Bell Pepper", quantity: 1, unit: "medium" },
        ],
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Asian", "Dinner", "Lunch"],
      },
      {
        name: "Teriyaki Salmon",
        description:
          "Brush salmon fillets with teriyaki sauce and bake in the oven until cooked through. Serve with steamed broccoli and brown rice.",
        ingredients: [
          { id: 2, name: "Salmon", quantity: 1, unit: "pound" },
          { id: 3, name: "Garlic", quantity: 2, unit: "cloves" },
          { id: 38, name: "Brown Rice", quantity: 1, unit: "cup" },
        ],
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Asian", "Dinner", "Lunch"],
      },
      {
        name: "Southwest Scramble",
        description:
          "A delicious and hearty breakfast scramble with potatoes, bacon, veggies, and eggs. Serve with avocado on top.",
        ingredients: [
          { id: 5, name: "Bacon", quantity: 8, unit: "slices" },
          { id: 6, name: "Potatoes", quantity: 2, unit: "large" },
          { id: 7, name: "Onions", quantity: 1, unit: "medium" },
          { id: 8, name: "Bell Pepper", quantity: 1, unit: "medium" },
          { id: 9, name: "Green Chiles", quantity: 1, unit: "can" },
          { id: 10, name: "Spinach", quantity: 1, unit: "cup" },
          { id: 11, name: "Eggs", quantity: 4, unit: "" },
          { id: 12, name: "Sea Salt", quantity: 1, unit: "tsp" },
          { id: 13, name: "Pepper", quantity: 1, unit: "tsp" },
          { id: 14, name: "Avocado", quantity: 1, unit: "" },
        ],
        upvotes: 0,
        price: 6,
        image: "",
        tags: ["Breakfast", "Brunch", "South Western"],
      },
      {
        name: "Homemade Electrolytes",
        description:
          "Add the water, orange juice, lemon juice, lime juice and ginger to a medium-sized saucepan. Place over a medium heat and bring to a simmer. Add the baking soda and salt to the pot. Stir to dissolve. Turn the heat down to medium-low and gently simmer for about 2 minutes. Remove from the heat and stir in 2 tablespoons maple syrup or honey until fully dissolved. Place a fine mesh strainer over a bowl and strain to filter out the solid ginger pieces and citrus seeds. Taste and sweeten with more maple/honey if needed. Serve hot or cold.",
        ingredients: [
          { id: 12, name: "Sea Salt", quantity: 1, unit: "tsp" },
          { id: 16, name: "Ginger", quantity: 1, unit: "tbsp" },
          { id: 17, name: "Orange Juice", quantity: 1, unit: "cup" },
          { id: 18, name: "Lemon Juice", quantity: 1, unit: "tbsp" },
          { id: 19, name: "Lime Juice", quantity: 1, unit: "tbsp" },
          { id: 20, name: "Baking Soda", quantity: 1, unit: "tsp" },
          { id: 21, name: "Maple Syrup", quantity: 2, unit: "tbsp" },
          { id: 22, name: "Honey", quantity: 1, unit: "tbsp" },
          { id: 15, name: "Water", quantity: 1, unit: "cup" },
        ],
        upvotes: 0,
        price: 1,
        image: "",
        tags: ["Breakfast", "Brunch", "Gluten Free", "Drinks"],
      },
      {
        name: "Buttery Egg Yolk Coffee",
        description:
          "Blend (or use immersion blender) coffee and egg yolks until fluffy. Add sugar, salt and butter to the blender. Pour into a mug with a splash of cream.",
        ingredients: [
          { id: 23, name: "Coffee", quantity: 1, unit: "cup" },
          { id: 24, name: "Egg Yolks", quantity: 2, unit: "" },
          { id: 25, name: "Butter", quantity: 1, unit: "tbsp" },
          { id: 26, name: "Sugar", quantity: 1, unit: "tsp" },
          { id: 27, name: "Cream", quantity: 1, unit: "splash" },
          { id: 12, name: "Sea Salt", quantity: 1, unit: "pinch" },
        ],
        upvotes: 0,
        price: 1,
        image: "",
        tags: ["Breakfast", "Brunch", "Gluten Free", "Drinks"],
      },
      {
        name: "Protein Ice Cream",
        description: "Blend until smooth and freeze",
        ingredients: [
          { id: 21, name: "Maple Syrup", quantity: 1, unit: "cup" },
          {
            id: 27,
            name: "Whole Milk Cottage Cheese",
            quantity: 1,
            unit: "container",
          },
          { id: 26, name: "Strawberries", quantity: 4, unit: "cup" },
        ],
        upvotes: 0,
        price: 2,
        image: "",
        tags: ["Gluten Free", "Dessert"],
      },
    ];

    const createdMeals = [];

    for (let i = 0; i < mealsToCreate.length; i++) {
      const meal = mealsToCreate[i];
      const { name, description, upvotes, price, image, tags } = meal;

      const {
        rows: [createdMeal],
      } = await client.query(
        `
          INSERT INTO meals(name, description, ingredients, upvotes, price, active, image)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
        `,
        [name, description, meal.ingredients, upvotes, price, true, image]
      );

      const createdIngredients = [];

      for (let j = 0; j < meal.ingredients.length; j++) {
        const { id, quantity } = meal.ingredients[j];
        console.log(meal.ingredients[j], "/////////");
        console.log("ingredient id:", id);
        const {
          rows: [createdMealIngredient],
        } = await client.query(
          `
            INSERT INTO meal_ingredients(meal_id, ingredient_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING *;
          `,
          [createdMeal.id, meal.ingredients[j].id, quantity]
        );
        console.log(createdMealIngredient, "CREATED MEAL INGREDIENT LOG");
        createdIngredients.push(createdMealIngredient);
      }

      for (let j = 0; j < tags.length; j++) {
        const tagName = tags[j];
        const {
          rows: [tag],
        } = await client.query(
          `
            SELECT *
            FROM tags
            WHERE name = $1;
          `,
          [tagName]
        );

        if (tag) {
          console.log(tag, "TAG LOG");
          await addTagToMeal(createdMeal.id, tag.id);
        }
      }

      createdMeals.push({
        ...createdMeal,
        ingredients: createdIngredients,
      });
    }

    console.log("meals created:");
    for (let i = 0; i < createdMeals.length; i++) {
      const meal = createdMeals[i];
      console.log("Meal:", meal);
      const tags = await getTagsByMeal(meal.id);
      console.log("Tags:", tags);
    }
    console.log("Finished creating meals!");
  } catch (error) {
    console.error("Error creating meals!");
    throw error;
  }
}
async function createInitialMealPlan() {
  try {
    await client.connect();

    // Add meals to the meal plan for each day from Monday to Sunday
    const mealIds = [1, 2, 3, 4, 5, 6];
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const weekNumber = 1;

    for (let i = 0; i < daysOfWeek.length; i++) {
      const { rows: mealPlans } = await client.query(
        `
        INSERT INTO meal_plans (week_number, day_of_week, meal_id, meal_name, meal_description)
        SELECT $1, COALESCE($2, 'Monday'), meals.id, meals.name, meals.description
        FROM meals
        WHERE meals.id IN (${mealIds.join(", ")})
        RETURNING *;
        `,
        [weekNumber, daysOfWeek[i]]
      );

      console.log("Meal Plan created:", mealPlans);
    }

    await client.release();
    console.log("Finished creating meal plan!");
  } catch (e) {
    console.error(e);
    throw new Error("Error creating initial meal plan");
  }
}

async function rebuildDB() {
  await dropTables();
  await createTables();
  await createInitialUsers();
  await createAdminUsers();
  await createInitialTags();
  await createInitialCart();
  const ingredients = await createInitialIngredients();
  await createInitialMeals(ingredients);
  await createInitialMealPlan();
}

rebuildDB();
