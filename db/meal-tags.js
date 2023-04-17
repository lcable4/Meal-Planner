const client = require("./index");

async function addTagToMeal(mealId, tagId) {
  try {
    await client.connect();

    const {
      rows: [meal_tag],
    } = await client.query(
      `
          INSERT INTO meal_tags("mealId", "tagId")
          VALUES ($1, $2)
          ON CONFLICT("mealId", "tagId") DO NOTHING
          RETURNING *;
        `,
      [mealId, tagId]
    );
    await client.release();

    return meal_tag;
  } catch (e) {
    console.error(e);
    throw new Error("Error adding tag");
  }
}

async function removeTagFromMeal(tagId, mealId) {
  try {
    await client.connect();

    const {
      rows: [tag],
    } = await client.query(
      `
      DELETE FROM meal_tags
      WHERE "tagId" = $1 AND "mealId" = $2
      RETURNING *;
      `,
      [tagId, mealId]
    );
    await client.release();

    return tag;
  } catch (error) {
    throw error;
  }
}

async function getTagsByMeal(mealId) {
  try {
    await client.connect();

    const { rows } = await client.query(
      `
      SELECT tags.*
      FROM tags
      JOIN meal_tags ON tags.id = meal_tags."tagId"
      WHERE meal_tags."mealId" = $1;
      `,
      [mealId]
    );
    await client.release();
    return rows;
  } catch (error) {
    console.error("Error in getTagsByMeal:", error);
    throw error;
  }
}

async function getMealsByTag(tagId) {
  try {
    await client.connect();
    const { rows } = await client.query(
      `
      SELECT *
      FROM meal_tags
      INNER JOIN meals
      ON meal_tags."mealId" = meals.id
      WHERE meal_tags."tagId" = $1;
      `,
      [tagId]
    );
    await client.release();
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addTagToMeal,
  removeTagFromMeal,
  getTagsByMeal,
  getMealsByTag,
};
