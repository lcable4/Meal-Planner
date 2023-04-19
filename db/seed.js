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

async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.connect();
    await client.query(`
        DROP TABLE IF EXISTS guest_cart_items;
        DROP TABLE IF EXISTS cart_items;
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS guest_cart;
        DROP TABLE IF EXISTS meal_tags;
        DROP TABLE IF EXISTS meal_ingredients;
        DROP TABLE IF EXISTS ingredients;
        DROP TABLE IF EXISTS meals;
        DROP TABLE IF EXISTS tags;
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
          upvotes INTEGER,
          price INTEGER NOT NULL,
          active BOOLEAN DEFAULT TRUE,
          image VARCHAR(255)
        );
        
          CREATE TABLE ingredients(
            id SERIAL PRIMARY KEY UNIQUE,
            name VARCHAR(255) NOT NULL,
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
      "Indian",
      "Dessert",
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

async function createInitialMeals() {
  console.log("Starting to create meals...");
  try {
    const mealsToCreate = [
      {
        name: "Stir-Fried Ginger Chicken with Vegetables",
        description:
          "Cook sliced chicken breast in a pan with ginger, garlic, soy sauce, and sesame oil. Add sliced vegetables like bell peppers, carrots, and snow peas and stir-fry until tender. Serve over brown rice.",
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Asian"],
      },
      {
        name: "Teriyaki Salmon",
        description:
          "Brush salmon fillets with teriyaki sauce and bake in the oven until cooked through. Serve with steamed broccoli and brown rice.",
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Asian"],
      },
      {
        name: "Vegetable Fried Rice",
        description:
          "Cook brown rice according to package instructions. In a pan, sauté chopped onion, garlic, and ginger until fragrant. Add diced carrots, bell peppers, and peas and stir-fry until cooked. Push the vegetables to the side and scramble an egg in the same pan. Add the cooked rice and mix everything together. Season with soy sauce and sesame oil.",
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Asian"],
      },
      {
        name: "Spicy Peanut Noodles",
        description:
          "Cook udon noodles according to package instructions. In a bowl, whisk together peanut butter, soy sauce, rice vinegar, sriracha, and honey. Add the cooked noodles and sliced scallions to the bowl and toss until coated. Serve with steamed broccoli or snap peas.",
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Asian"],
      },
      {
        name: "Miso Soup with Tofu and Vegetables",
        description:
          "In a pot, bring vegetable broth to a simmer. Add sliced mushrooms, diced tofu, and chopped bok choy. Whisk together miso paste and hot water and add to the pot. Simmer for a few minutes until everything is heated through. Serve hot.",
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Asian"],
      },
      {
        name: "Italian Dish",
        description: "dasdasdasdasdasdasdasd",
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Italian"],
      },
      {
        name: "Italian Dish",
        description: "dasdasdasdasdasdasdasd",
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Italian"],
      },
      {
        name: "Italian Dish",
        description: "dasdasdasdasdasdasdasd",
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Italian"],
      },
      {
        name: "Italian Dish",
        description: "dasdasdasdasdasdasdasd",
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Italian"],
      },
      {
        name: "Italian Dish",
        description: "dasdasdasdasdasdasdasd",
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Italian"],
      },
      {
        name: "Indian Dish",
        description: "dasdasdasdasdasdasdasd",
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Indian"],
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
          INSERT INTO meals(name, description, upvotes, price, active, image)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
        `,
        [name, description, upvotes, price, true, image]
      );

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
      createdMeals.push(createdMeal);
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

async function createInitialIngredients() {
  console.log("Starting to create ingredients...");
  try {
    const ingredientsToCreate = [
      {
        name: "Chicken Breast",
      },
      {
        name: "Chicken Thighs",
      },
      {
        name: "Carrots",
      },
      {
        name: "Beef",
      },
      {
        name: "Bacon",
      },
      {
        name: "Potatoes",
      },
      {
        name: "Onions",
      },
      {
        name: "Bell Pepper",
      },
      {
        name: "Green Chiles",
      },
      {
        name: "Spinach",
      },
      {
        name: "Eggs",
      },
      {
        name: "Sea Salt",
      },
      {
        name: "Pepper",
      },
      {
        name: "Avocado",
      },
      {
        name: "Water",
      },
      {
        name: "Ginger",
      },
      {
        name: "Orange Juice",
      },
      {
        name: "Lemon Juice",
      },
      {
        name: "Lime Juice",
      },
      {
        name: "Baking Soda",
      },
      {
        name: "Maple Syrup",
      },
      {
        name: "Honey",
      },
      {
        name: "Coffee",
      },
      {
        name: "Egg Yolks",
      },
      {
        name: "Butter",
      },
      {
        name: "Sugar",
      },
      {
        name: "Cream",
      },
      {
        name: "Cottage Cheese",
      },
      {
        name: "Strawberries",
      },
      {
        name: "Olive Oil",
      },
      {
        name: "Lemon Zest",
      },
      {
        name: "Garlic Powder",
      },
      {
        name: "Lemon",
      },
      {
        name: "Parsley",
      },
      {
        name: "Asparagus",
      },
      {
        name: "Grated Parmesan",
      },
    ];
    const createdIngredients = [];

    for (let i = 0; i < ingredientsToCreate.length; i++) {
      const ingredient = ingredientsToCreate[i];
      const { name } = ingredient;

      const {
        rows: [createdIngredient],
      } = await client.query(
        `
          INSERT INTO ingredients(name)
          VALUES ($1)
          RETURNING *;
        `,
        [name]
      );

      createdIngredients.push(createdIngredient);
    }
    console.log("ingredients created:");
    for (let i = 0; i < createdIngredients.length; i++) {
      const ingredient = createdIngredients[i];
      console.log("ingredient:", ingredient);
      const tags = await getIngredientsByMeal(1);
      console.log("Ingredients:", tags);
    }
    console.log("Finished creating ingredients!");
  } catch (error) {
    console.error("Error creating ingredients!");
    throw error;
  }
}

async function rebuildDB() {
  await dropTables();
  await createTables();
  await createInitialUsers();
  await createAdminUsers();
  await createInitialTags();
  await createInitialCart();
  await createInitialMeals();
  await createInitialIngredients();
}
rebuildDB();
