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
      "Chicken",
      "Beef",
      "Pork",
      "Fish",
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
      { name: "Chile Powder" },
      { name: "Smoked Paprika" },
      { name: "Salsa Verde" },
      { name: "Cream Cheese" },
      { name: "Cilantro" },
      { name: "Corn Tortillas" },
      { name: "Cheddar" },
      { name: "Brussel Sprouts" },
      { name: "Hot Sauce" },
      { name: "Cayenne Pepper" },
      { name: "Onion Powder" },
      { name: "Chili Powder" },
      { name: "Cumin" },
      { name: "Corn" },
      { name: "Jalapenos" },
      { name: "Rice" },
      { name: "Thyme" },
      { name: "Short Ribs" },
      { name: "Bay Leaves" },
      { name: "Beef Broth" },
      { name: "Greek Yogurt" },
      { name: "Green Onion" },
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
    }
    console.log("ingredients created:", createdIngredients);
    console.log("Finished creating ingredients!");
    return createdIngredients;
  } catch (error) {
    console.error("Error creating ingredients!");
    throw error;
  }
}
async function createInitialMeals() {
  console.log("Starting to create meals...");

  try {
    const mealsToCreate = [
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
      {
        name: "Lemon Pepper Chicken Thighs",
        description:
          "Preheat oven to 350 degrees. In a small bowl, combine lemon zest, garlic powder, salt and pepper. Place chicken breasts in a baking dish. Rub chicken on all sides with the lemon pepper mixture. Bake for 25-30 minutes until internal temperature reaches 165 degrees. Toss the potato wedges and asparagus in olive oil, salt, and pepper. Place the potatoes and asparagus on a sheet pan and bake at the same time as chicken. Chicken and asparagus for 25-30 minutes, potatoes for about 1 hour. Top with grated parmesan.",
        ingredients: [
          { id: 2, name: "Chicken Thighs", quantity: 4, unit: "thighs" },
          { id: 32, name: "Olive Oil", quantity: 1, unit: "tbsp" },
          { id: 19, name: "Lemon Juice", quantity: "1/4", unit: "cup" },
          { id: 33, name: "Lemon Zest", quantity: 3, unit: "lemons" },
          { id: 34, name: "Garlic Powder", quantity: "1/2", unit: "tsp" },
          { id: 13, name: "Sea Salt", quantity: null, unit: null },
          { id: 14, name: "Pepper", quantity: null, unit: null },
          { id: 36, name: "Parsley", quantity: null, unit: null },
          { id: 7, name: "Potatoes", quantity: 4, unit: "potatoes" },
          { id: 37, name: "Asparagus", quantity: null, unit: null },
          { id: 38, name: "Grated Parmesan", quantity: null, unit: null },
        ],
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Dinner", "Lunch", "Chicken"],
      },
      {
        name: "Green Chile Enchilada Bake",
        description:
          "Preheat the oven to 400 degrees. In a large oven-safe skillet, combine the olive oil, beef, onion, and peppers. Cook, breaking up the meat as it cooks, until browned, about 5 minutes. Add the chili powder, paprika, and garlic powder, 1 cup water, 6 oz salsa verde, and season with salt. Simmer 5-8 minutes. Mix in the cream cheese until melted. Remove from the heat and stir in the cilantro. Sprinkle the shredded cheese onto the top of the meat mixture. Place the tortillas in a flat layer overtop of the meat. Pour over the remaining jar of salsa verde. Top with the remaining shredded cheddar. Bake for 15-20 minutes, until the cheese has melted.Serve warm. Top with avocado, cilantro, chopped green onions, jalapeños, pico de gallo, etc.",
        ingredients: [
          { id: 5, name: "Beef", quantity: 1, unit: "lb" },
          { id: 8, name: "Onions", quantity: 1, unit: "onion" },
          { id: 43, name: "Chile Powder", quantity: null, unit: null },
          { id: 44, name: "Smoked Paprika", quantity: null, unit: null },
          { id: 34, name: "Garlic Powder", quantity: null, unit: null },
          { id: 13, name: "Sea Salt", quantity: null, unit: null },
          { id: 14, name: "Pepper", quantity: null, unit: null },
          { id: 45, name: "Salsa Verde", quantity: null, unit: null },
          { id: 46, name: "Cream Cheese", quantity: null, unit: null },
          { id: 47, name: "Cilantro", quantity: null, unit: null },
          { id: 48, name: "Corn Tortillas", quantity: null, unit: null },
          { id: 49, name: "Cheddar", quantity: null, unit: null },
        ],
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Mexican", "Dinner", "Lunch", "Beef"],
      },
      {
        name: "Hot Honey Salmon Bowls With Avocado Crema",
        description:
          "Preheat the oven to 450 degrees. On a baking sheet, toss the salmon with 3 tbsp olive oil, paprika, salt, and pepper. Arrange in a single layer. On the other side of the pan, add the brussels sprouts. Toss with olive oil, salt, and pepper. Roast 10-15 minutes or until the salmon is just undercooked. To make the hot honey, warm together the honey, hot sauce, cayenne, chili powder, onion powder, and garlic powder, and salt. Spoon some of the hot honey over the salmon. Switch the oven to broil and broil until lightly charred and crispy. Spoon over more hot honey if desired. Arrange the salmon and asparagus over bowls of rice. Top with crema.",
        ingredients: [
          { id: 3, name: "Salmon", quantity: null, unit: null },
          { id: 32, name: "Olive Oil", quantity: null, unit: null },
          { id: 44, name: "Smoked Paprika", quantity: null, unit: null },
          { id: 13, name: "Sea Salt", quantity: null, unit: null },
          { id: 14, name: "Pepper", quantity: null, unit: null },
          { id: 23, name: "Honey", quantity: null, unit: null },
          { id: 43, name: "Chile Powder", quantity: null, unit: null },
          { id: 34, name: "Garlic Powder", quantity: null, unit: null },
          { id: 50, name: "Brussel Sprouts", quantity: null, unit: null },
          { id: 51, name: "Hot Sauce", quantity: null, unit: null },
          { id: 52, name: "Cayenne Pepper", quantity: null, unit: null },
          { id: 53, name: "Onion Powder", quantity: null, unit: null },
          { id: 54, name: "Rice", quantity: null, unit: null },
        ],
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Mexican", "Dinner", "Lunch", "Fish"],
      },
      {
        name: "Slow Cooked French Onion Short Ribs",
        description:
          "Preheat oven to 300 degrees. Heat a dutch oven over medium/high heat. Add 2 tablespoons of olive oil and the sliced onions. Cook, stirring only occasionally, for 5 minutes. Add the butter to the onions along with salt, pepper, and thyme sprigs. Cook, stirring only occasionally for 15-20 minutes, or until the onions are lightly golden brown and caramelized. Remove the thyme sprigs. Remove the onions and set aside. Add the olive oil to the same skillet and season the prepared short ribs with the salt and pepper. Heat the skillet to medium/high and sear the short ribs on all sides until deeply brown (about 4-5 minutes per side). Add the bay leaves and additional fresh thyme to the pot with the short ribs. Top the ribs with the caramelized onions. Set aside. Reduce the heat to medium/low. Add the beef stock and scrape up the browned bits from the bottom. Season the braising liquid with salt and pepper. Pour the braising liquid over the prepared short ribs in the dutch oven and cover the pot. Cook, covered, for 3 hours. Use a slotted spoon to remove the short ribs and caramelized onions from the pot (keep warm), leaving the liquid behind. Place the braising liquid in the dutch oven onto the stovetop and bring it to a medium simmer. Simmer for about 10 minutes to thicken and reduce the sauce. To serve, add the ribs and onions to a platter and spoon the sauce over top.",
        ingredients: [
          { id: 8, name: "Onions", quantity: null, unit: null },
          { id: 32, name: "Olive Oil", quantity: null, unit: null },
          { id: 26, name: "Butter", quantity: null, unit: null },
          { id: 13, name: "Sea Salt", quantity: null, unit: null },
          { id: 14, name: "Pepper", quantity: null, unit: null },
          { id: 55, name: "Thyme", quantity: null, unit: null },
          { id: 56, name: "Short Ribs", quantity: null, unit: null },
          { id: 57, name: "Bay Leaves", quantity: null, unit: null },
          { id: 58, name: "Beef Broth", quantity: null, unit: null },
        ],
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Dinner", "Lunch", "Beef"],
      },
      {
        name: "Chicken Fajita Tortilla Bowls",
        description:
          "Toss the chicken in olive oil, paprika, chili powder, cumin, salt, and pepper. Heat a skillet over high heat. Cook until seared all over and cooked through, 8-10 minutes. During the last 2 minutes of cooking, add the garlic. Cook 1 minute, then remove and set aside. In the same skillet, add the onions and cook until fragrant, about 5 minutes. Toss in the bell peppers. Season with salt and pepper. Cook until the peppers are tender, another 5 minutes. Add the chicken back to the pan. Add the frozen corn to  a skillet and cook until charred on all sides. To make the vinaigrette, combine all ingredients in a glass jar and shake. Season with salt. Spoon the chicken and peppers over the bowls of rice. Top with lettuce and the corn. Pour over the vinaigrette. Top with avocado, jalapeños, feta, and cilantro. Serve with tortillas.",
        ingredients: [
          { id: 32, name: "Olive Oil", quantity: null, unit: null },
          { id: 1, name: "Chicken Breast", quantity: null, unit: null },
          { id: 44, name: "Smoked Paprika", quantity: null, unit: null },
          { id: 13, name: "Sea Salt", quantity: null, unit: null },
          { id: 14, name: "Pepper", quantity: null, unit: null },
          { id: 8, name: "Onions", quantity: null, unit: null },
          { id: 4, name: "Garlic", quantity: null, unit: null },
          { id: 9, name: "Bell Pepper", quantity: null, unit: null },
          { id: 54, name: "Rice", quantity: null, unit: null },
          { id: 45, name: "Salsa Verde", quantity: null, unit: null },
          { id: 20, name: "Lime Juice", quantity: null, unit: null },
          { id: 23, name: "Honey", quantity: null, unit: null },
          { id: 47, name: "Cilantro", quantity: null, unit: null },
          { id: 54, name: "Chili Powder", quantity: null, unit: null },
          { id: 55, name: "Cumin", quantity: null, unit: null },
          { id: 56, name: "Corn", quantity: null, unit: null },
          { id: 57, name: "Jalapenos", quantity: null, unit: null },
        ],
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["Mexican", "Dinner", "Lunch", "Chicken"],
      },
      {
        name: "Sheet Pan Chili Honey Chicken",
        description:
          "Heat the oven 375 degrees. Line a baking sheet with parchment paper. In a small bowl mix together the warmed honey, olive oil, cayenne, chili powder, salt, pepper, ginger and garlic powder until fully combined. Place the chicken and sweet potatoes on the baking sheet and pour the spice mixture over and toss until completely coated. Place the chicken and potatoes in the oven for 15 minutes before turning the broiler onto high for 5-8 until the chicken is caramelized and browned and the sweet potatoes are tender. Meanwhile, in the base of a food processor or blender, add the greek yogurt, cilantro, lime juice, garlic powder, salt, jalapeño, chili powder and 2 green onions, blend until smooth.",
        ingredients: [
          { id: 23, name: "Honey", quantity: 3, unit: "tbsp" },
          { id: 32, name: "Olive Oil", quantity: "1/4", unit: "cup" },
          { id: 2, name: "Chicken Thighs", quantity: "2 1/2", unit: "lbs" },
          { id: 52, name: "Cayenne Pepper", quantity: "1/4", unit: "tsp" },
          { id: 54, name: "Chili Powder", quantity: 2, unit: "tsp" },
          { id: 34, name: "Garlic Powder", quantity: "1/2", unit: "tsp" },
          { id: 17, name: "Ginger", quantity: "1/2", unit: "tsp" },
          { id: 13, name: "Sea Salt", quantity: null, unit: null },
          { id: 14, name: "Pepper", quantity: null, unit: null },
          { id: 7, name: "Potatoes", quantity: 4, unit: null },
          { id: 47, name: "Cilantro", quantity: "1/4", unit: "cup" },
          { id: 20, name: "Lime Juice", quantity: 1, unit: "tsp" },
          { id: 57, name: "Jalapenos", quantity: 1, unit: null },
          { id: 63, name: "Greek Yogurt", quantity: "3/4", unit: "cup" },
          { id: 64, name: "Green Onion", quantity: 6, unit: null },
        ],
        upvotes: 0,
        price: 5,
        image: "",
        tags: ["American", "Dinner", "Lunch", "Chicken"],
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
        const { id, quantity, unit } = meal.ingredients[j];
        const {
          rows: [createdMealIngredient],
        } = await client.query(
          `
              INSERT INTO meal_ingredients(meal_id, ingredient_id, quantity, unit)
              VALUES ($1, $2, $3, $4)
              RETURNING *;
            `,
          [createdMeal.id, meal.ingredients[j].id, quantity, unit]
        );
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
