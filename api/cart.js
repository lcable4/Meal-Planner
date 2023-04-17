const express = require("express");
const cartRouter = express.Router();

const {
  addMealToCart,
  getCartItemsByCartId,
  updateMealQuantity,
  removeMealFromCart,
  clearCart,
  clearGuestCart,
} = require("../db/cart-items");
const { getCartByUserId, createCart } = require("../db/cart");
const { requireUser } = require("./utils");
const {
  getCartByGuestId,
  addMealToGuestCart,
  getCartItemsByGuestCartId,
  updateGuestMealQuantity,
  removeMealFromGuestCart,
} = require("../db/guests");

// /api/cart/:userId/:carId
cartRouter.post("/", async (req, res, next) => {
  const { mealId, price } = req.body;

  try {
    console.log("////////////////", req.user);
    if (req.user && !req.user.guest) {
      const userId = req.user.id;
      let userCart = await getCartByUserId(userId);
      console.log("usercart", userCart);
      if (!userCart && req.user) {
        userCart = await createCart(userId);
        console.log("usercart", userCart);
      }

      if (userCart) {
        const cartItem = await addMealToCart(mealId, userCart.cartId, price);
        res.send(cartItem);
      }
    } else if (req.user.guest) {
      const guestId = req.user.guest.id;
      let cart = await getCartByGuestId(guestId);
      console.log(cart);
      const cartItem = await addMealToGuestCart(carId, cart.cartId, price);
      console.log(cartItem);
      res.send(cartItem);
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    next(e);
  }
});

cartRouter.get("/", async (req, res, next) => {
  try {
    if (req.user && !req.user.guest) {
      const userId = req.user.id;
      const cart = await getCartByUserId(userId);
      if (cart) {
        const cartItems = await getCartItemsByCartId(cart.cartId);
        console.log(cartItems);
        res.send(cartItems);
      } else {
        const newCart = await createCart(userId);
      }
    } else if (req.user.guest) {
      const userId = req.user.guest.id;
      const cart = await getCartByGuestId(userId);
      if (cart) {
        console.log("here");
        const cartItems = await getCartItemsByGuestCartId(cart.cartId);
        console.log(cartItems);
        res.send(cartItems);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    throw e;
  }
});

cartRouter.patch("/", async (req, res, next) => {
  const { mealId, quantity } = req.body;
  try {
    if (req.user && !req.user.guest) {
      const userId = req.user.id;
      let cart = await getCartByUserId(userId);
      if (!cart) {
        cart = await createCart(userId);
      }
      if (cart) {
        const meal = await updateMealQuantity(mealId, cart.cartId, quantity);
        res.send(meal);
      }
    } else if (req.user.guest) {
      const userId = req.user.guest.id;
      let cart = await getCartByGuestId(userId);
      if (cart) {
        const meal = await updateGuestMealQuantity(
          mealId,
          cart.cartId,
          quantity
        );
        res.send(meal);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    throw e;
  }
});

cartRouter.delete("/", async (req, res, next) => {
  const { mealId } = req.body;
  try {
    if (req.user && !req.user.guest) {
      const userId = req.user.id;
      const cart = await getCartByUserId(userId);
      if (cart) {
        const removed = await removeMealFromCart(mealId, cart.cartId);
        res.send(removed);
      }
    } else if (req.user.guest) {
      const userId = req.user.guest.id;
      const cart = await getCartByGuestId(userId);
      if (cart) {
        const removed = await removeMealFromGuestCart(mealId, cart.cartId);
        res.send(removed);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    throw e;
  }
});

cartRouter.delete("/clear-cart/", async (req, res, next) => {
  try {
    console.log(req.user, "/////req.user/////");
    if (req.user && !req.user.guest) {
      const userCart = await getCartByUserId(req.user.id);
      const clearedCart = await clearCart(userCart.cartId);
      console.log(clearedCart, "/////clearedCart//////");
      console.log(userCart, "//////////userCart/////////////");
      if (clearedCart) {
        res.send(clearedCart);
      }
    } else if (req.user.guest) {
      const userCart = await getCartByGuestId(req.user.guest.id);
      console.log(userCart);
      const clearedCart = await clearGuestCart(userCart.cartId);
      console.log(clearedCart);
      if (clearedCart) {
        res.send(clearedCart);
      }
    }
  } catch (error) {
    throw error;
  }
});

module.exports = cartRouter;
