const express = require("express");
const mealTagsRouter = express.Router();
const { requireUser } = require("./utils");
const {
  addTagToMeal,
  removeTagFromMeal,
  getTagsByMeal,
  getMealsByTag,
} = require("../db/meal-tags");
const { getMealById } = require("../db/meals");
const { getTagById } = require("../db/tags");

mealTagsRouter.use((req, res, next) => {
  console.log("a request is being made to /meal-tags");

  next();
});

mealTagsRouter.get("/", (req, res, next) => {
  res.send("hello world");
  next();
});
//this route needs to be changed! || can just be post("/") and req.body{tagId, mealId}
mealTagsRouter.post("/add-tag/:tagId/:mealId", async (req, res, next) => {
  try {
    if (req.admin) {
      const { tagId, mealId } = req.params;
      const checkMealId = await getMealById(mealId);
      if (!checkMealId) {
        next({
          name: "mealDoesNotExist",
          message: `a meal with id: ${mealId} does not exist`,
        });
      } else {
        const checkTagId = await getTagById(tagId);
        if (!checkTagId) {
          next({
            name: "tagDoesNotExist",
            message: `a tag with id: ${tagId} does not exist`,
          });
        } else {
          const mealTag = await addTagToMeal(mealId, tagId);
          console.log(mealTag, " mealTag!");

          if (mealTag) {
            res.send(mealTag);
          } else {
            next({
              name: "errorAddingTagsToMeal",
              message: `error adding tagId: ${tagId} to mealId: ${mealId}`,
            });
          }
        }
      }
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
});
//this route also needs to be changed || .delete(/) req.body{tagId, mealId}
mealTagsRouter.delete("/delete/:tagId/:mealId", async (req, res, next) => {
  try {
    if (req.admin) {
      const { tagId, mealId } = req.params;

      const deletedMeal = await removeTagFromMeal(tagId, mealId);

      res.send(deletedMeal);
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
});
//this route should probably be moved to into the /api/meals route
mealTagsRouter.get("/tags-by-meal/:mealId", async (req, res, next) => {
  try {
    const { mealId } = req.params;

    const tags = await getTagsByMeal(mealId);

    res.send(tags);
  } catch (error) {
    next(error);
  }
});
//this route could be changed to .get(/:tagId) if getTagsBymeal is moved
mealTagsRouter.get("/meals-by-tag/:tagId", async (req, res, next) => {
  try {
    const { tagId } = req.params;

    const meals = await getMealsByTag(tagId);

    res.send(meals);
  } catch (error) {
    next(error);
  }
});

module.exports = mealTagsRouter;
