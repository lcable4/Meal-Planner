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
        DROP TABLE IF EXISTS meal_plans;
        DROP TABLE IF EXISTS meal_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS meal_ingredients;
        DROP TABLE IF EXISTS meals;
        DROP TABLE IF EXISTS ingredients;
        DROP TABLE IF EXISTS users;
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
          price INTEGER NOT NULL,
          active BOOLEAN DEFAULT TRUE,
          image VARCHAR(255)
        );
        
          CREATE TABLE ingredients(
            id SERIAL PRIMARY KEY UNIQUE,
            name TEXT NOT NULL,
            quantity INTEGER,
            unit TEXT
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
          meal_id INTEGER REFERENCES meals(id) ON DELETE CASCADE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          date DATE NOT NULL,
          UNIQUE(meal_id, user_id, date)
        );
        
        CREATE TABLE meal_plan_ingredients (
          meal_plan_id INTEGER REFERENCES meal_plans(id),
          ingredient_id INTEGER REFERENCES ingredients(id),
          quantity INTEGER,
          PRIMARY KEY(meal_plan_id, ingredient_id)
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
      { name: "Chicken Breast", quantity: null, unit: null },
      { name: "Salmon", quantity: null, unit: null },
      { name: "Garlic", quantity: null, unit: null },
      {
        name: "Beef",
        quantity: null,
        unit: null,
      },
      {
        name: "Bacon",
        quantity: null,
        unit: null,
      },
      {
        name: "Potatoes",
        quantity: null,
        unit: null,
      },
      {
        name: "Onions",
        quantity: null,
        unit: null,
      },
      {
        name: "Bell Pepper",
        quantity: null,
        unit: null,
      },
      {
        name: "Green Chiles",
        quantity: null,
        unit: null,
      },
      {
        name: "Spinach",
        quantity: null,
        unit: null,
      },
      {
        name: "Eggs",
        quantity: null,
        unit: null,
      },
      {
        name: "Sea Salt",
        quantity: null,
        unit: null,
      },
      {
        name: "Pepper",
        quantity: null,
        unit: null,
      },
      {
        name: "Avocado",
        quantity: null,
        unit: null,
      },
      {
        name: "Water",
        quantity: null,
        unit: null,
      },
      {
        name: "Ginger",
        quantity: null,
        unit: null,
      },
      {
        name: "Orange Juice",
        quantity: null,
        unit: null,
      },
      {
        name: "Lemon Juice",
        quantity: null,
        unit: null,
      },
      {
        name: "Lime Juice",
        quantity: null,
        unit: null,
      },
      {
        name: "Baking Soda",
        quantity: null,
        unit: null,
      },
      {
        name: "Maple Syrup",
        quantity: null,
        unit: null,
      },
      {
        name: "Honey",
        quantity: null,
        unit: null,
      },
      {
        name: "Coffee",
        quantity: null,
        unit: null,
      },
      {
        name: "Egg Yolks",
        quantity: null,
        unit: null,
      },
      {
        name: "Butter",
        quantity: null,
        unit: null,
      },
      {
        name: "Sugar",
        quantity: null,
        unit: null,
      },
      {
        name: "Cream",
        quantity: null,
        unit: null,
      },
      {
        name: "Cottage Cheese",
        quantity: null,
        unit: null,
      },
      {
        name: "Strawberries",
        quantity: null,
        unit: null,
      },
      {
        name: "Olive Oil",
        quantity: null,
        unit: null,
      },
      {
        name: "Lemon Zest",
        quantity: null,
        unit: null,
      },
      {
        name: "Garlic Powder",
        quantity: null,
        unit: null,
      },
      {
        name: "Lemon",
        quantity: null,
        unit: null,
      },
      {
        name: "Parsley",
        quantity: null,
        unit: null,
      },
      {
        name: "Asparagus",
        quantity: null,
        unit: null,
      },
      {
        name: "Grated Parmesan",
        quantity: null,
        unit: null,
      },
      {
        name: "Broccoli",
        quantity: null,
        unit: null,
      },
      {
        name: "Brown Rice",
        quantity: null,
        unit: null,
      },
      {
        name: "Soy Sauce",
        quantity: null,
        unit: null,
      },
      {
        name: "Ginger",
        quantity: null,
        unit: null,
      },
      {
        name: "Sesame Seeds",
        quantity: null,
        unit: null,
      },
    ];
    const createdIngredients = [];

    for (let i = 0; i < ingredientsToCreate.length; i++) {
      const ingredient = ingredientsToCreate[i];
      const { name, quantity, unit } = ingredient;

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
          { ingredient: "Chicken Breast", quantity: 1, unit: "lbs" },
          { ingredient: "Ginger", quantity: 2, unit: "teaspoons" },
          { ingredient: "Garlic", quantity: 2, unit: "teaspoons" },
          { ingredient: "Soy Sauce", quantity: 2, unit: "cup" },
          { ingredient: "Sesame Seeds", quantity: 2, unit: "teaspoons" },
          { ingredient: "Bell Pepper", quantity: 2, unit: "cup" },
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
          { ingredient: "Salmon", quantity: 2, unit: "lbs" },
          { ingredient: "Garlic", quantity: 1, unit: "cloves" },
          { ingredient: "Brown Rice", quantity: 1, unit: "cup" },
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
          { ingredient: "Bacon", quantity: 1, unit: "strips" },
          { ingredient: "Potatoes", quantity: 1, unit: "" },
          { ingredient: "Onions", quantity: 2, unit: "cup" },
          { ingredient: "Bell Pepper", quantity: 1, unit: "cup" },
          { ingredient: "Green Chiles", quantity: 1, unit: "" },
          { ingredient: "Spinach", quantity: 1, unit: "cup" },
          { ingredient: "Eggs", quantity: 1, unit: "" },
          { ingredient: "Sea Salt", quantity: 1, unit: "teaspoons" },
          { ingredient: "Pepper", quantity: 1, unit: "teaspoons" },
          { ingredient: "Avocado", quantity: 1, unit: "cup" },
        ],
        upvotes: 0,
        price: 6,
        image: "",
        tags: ["Breakfast", "Brunch", "Southwestern"],
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
        const { ingredient, quantity } = meal.ingredients[j];
        console.log(meal.ingredients[j], "/////////");
        console.log("ingredient:", ingredient);
        const {
          rows: [createdMealIngredient],
        } = await client.query(
          `
            INSERT INTO meal_ingredients(meal_id, ingredient_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING *;
          `,
          [createdMeal.id, ingredient.id, quantity]
        );

        createdIngredients.push(ingredient);
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

    // Set the meal plan date
    const date = new Date("2023-04-25");

    // Create a new meal plan for user with ID 1
    const {
      rows: [mealPlan],
    } = await client.query(
      `
        INSERT INTO meal_plans (meal_id, user_id, date)
        VALUES ($1, $2, $3)
        RETURNING *;
      `,
      [1, 2, date.toISOString()]
    );

    // Add meals to the meal plan
    const mealIds = [1, 2, 3]; // Example meal IDs
    for (const mealId of mealIds) {
      await client.query(
        `
          INSERT INTO meal_plans (meal_id, user_id, date)
          VALUES ($1, $2, $3);
        `,
        [mealId, 1, date.toISOString()]
      );
    }

    await client.release();
    console.log("Meal Plan created:", mealPlan);
    console.log("Finished creating meal plan!");
    return mealPlan;
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
