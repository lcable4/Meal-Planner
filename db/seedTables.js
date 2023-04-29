const client = require("./index");

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
          DROP TABLE IF EXISTS meal_plan_meals;
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
            week_number INTEGER NOT NULL,
            meal_ids INTEGER[] 
        );
        
        CREATE TABLE meal_plan_meals (
          id SERIAL PRIMARY KEY,
            meal_plan_id INTEGER NOT NULL,
            meal_id INTEGER NOT NULL,
            day_of_week VARCHAR(255) NOT NULL,
            FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id) ON DELETE CASCADE,
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

module.exports = {
  dropTables,
  createTables,
};
