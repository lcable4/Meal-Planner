const client = require("./index");

const { createUser } = require("./users");

const { createCart } = require("./cart");

const { createTag } = require("./tags");

const { createAdmin } = require("./admin");

const { addTagToMeal, getTagsByMeal } = require("./meal-tags");

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
      { name: "Chicken Breast" },
      { name: "Chicken Thighs" },
      { name: "Salmon" },
      { name: "Garlic" },
      { name: "Beef" },
      { name: "Bacon" },
      { name: "Potatoes" },
      { name: "Onions" },
      { name: "Bell Pepper" },
      { name: "Green Chiles" },
      { name: "Spinach" },
      { name: "Eggs" },
      { name: "Sea Salt" },
      { name: "Pepper" },
      { name: "Avocado" },
      { name: "Water" },
      { name: "Ginger" },
      { name: "Orange Juice" },
      { name: "Lemon Juice" },
      { name: "Lime Juice" },
      { name: "Baking Soda" },
      { name: "Maple Syrup" },
      { name: "Honey" },
      { name: "Coffee" },
      { name: "Egg Yolks" },
      { name: "Butter" },
      { name: "Strawberries" },
      { name: "Whole Milk Cottage Cheese" },
      { name: "Sugar" },
      { name: "Cream" },
      { name: "Cottage Cheese" },
      { name: "Olive Oil" },
      { name: "Lemon Zest" },
      { name: "Garlic Powder" },
      { name: "Lemon" },
      { name: "Parsley" },
      { name: "Asparagus" },
      { name: "Grated Parmesan" },
      { name: "Broccoli" },
      { name: "Brown Rice" },
      { name: "Soy Sauce" },
      { name: "Sesame Seeds" },
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
        name: "Lemon Pepper Chicken Thighs",
        description:
          "Cook sliced chicken breast in a pan with ginger, garlic, soy sauce, and sesame oil. Add sliced vegetables like bell peppers, carrots, and snow peas and stir-fry until tender. Serve over brown rice.",
        ingredients: [
          { id: 2, name: "Chicken Thighs", quantity: 4, unit: "thighs" },
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
        [
          name,
          description,
          JSON.stringify(meal.ingredients),
          upvotes,
          price,
          true,
          image,
        ]
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
module.exports = {
  createInitialUsers,
  createAdminUsers,
  createInitialTags,
  createInitialCart,
  createInitialIngredients,
  createInitialMeals,
};
