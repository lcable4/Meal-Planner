require("dotenv").config();

const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

//sets req.user if an auth token is provided || can be changed if to include checking if the auth is a user or website admin later
router.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  if (!auth) next();
  else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const vToken = jwt.verify(token, JWT_SECRET);
      console.log(vToken);
      if (vToken.isAdmin) {
        req.admin = true; //if a function can only be used by a admin it must check if(req.admin)
        next();
      } else if (vToken.guest) {
        req.user = { guest: await getGuestById(vToken.id) };
        next();
      } else if (vToken.id) {
        req.user = await getUserById(vToken.id); // if a function can only be used by a logged in user it must use if(req.user) or requireUser from ./utils
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

router.get("/", (req, res) => {
  res.send("Hello, world!");
});

const userRouter = require("./users");
//const tagsRouter = require("./tags");

router.use("/users", userRouter);
//router.use("/tags", tagsRouter);

//const inventoryRouter = require("./inventory");
//router.use("/inventory", inventoryRouter);

//const mealsRouter = require("./meals");
//router.use("/meals", mealsRouter);

//const mealsTagsRouter = require("./meal-tags");
//router.use("/meal-tags", mealsTagsRouter);

//const cartRouter = require("./cart");
//router.use("/cart", cartRouter);

//const adminRouter = require("./admin");
//router.use("/admin", adminRouter);

//const guestRouter = require("./guests");
//const { getGuestById } = require("../db/guests");
//router.use("/guests", guestRouter);

module.exports = router;
