const express = require("express");
const guestRoute = express.Router();

const jwt = require("jsonwebtoken");
const { createGuest } = require("../db/guests");
const { JWT_SECRET } = process.env;

//POST api/guest
guestRoute.post("/", async (req, res, next) => {
  const { name } = req.body;

  try {
    const guest = await createGuest(name);
    console.log(guest, "GUEST LOG 1");
    if (guest) {
      const token = jwt.sign(
        {
          id: guest.id,
          name,
          guest: true,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
      console.log(token, "guest token");
      res.send({ message: "Guest Created", token });
    } else {
      res.send("Error creating guest");
    }
  } catch (e) {
    throw e;
  }
});

module.exports = guestRoute;
