const client = require("./index");

// Creates a new cart and assigns it to the user whos ID is passed in
async function createCart(userId) {
  try {
    await client.connect();

    const {
      rows: [cart],
    } = await client.query(
      `
          INSERT INTO cart ("userId")
          VALUES ($1)
          RETURNING *;
        `,
      [userId]
    );

    await client.release();

    return cart;
  } catch (e) {
    console.error(e);
  }
}

//Gets the cart associated to the userId passed in.
async function getCartByUserId(userId) {
  try {
    await client.connect();

    const {
      rows: [cart],
    } = await client.query(
      `
      SELECT cart.id AS "cartId"
      FROM cart
      JOIN users ON cart."userId" = users.id
      WHERE users.id = $1;
        `,
      [userId]
    );

    await client.release();
    return cart;
  } catch (e) {
    console.error(e);
  }
}
//Updates the status of an item in the cart from isOrdered false to true
async function updateCartStatus(cartId) {
  try {
    await client.connect();

    const {
      rows: [cart],
    } = await client.query(
      `
          UPDATE cart
          SET "isOrdered" = true
          WHERE id = $1
          RETURNING *;
        `,
      [cartId]
    );

    await client.release();
    return cart;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  createCart,
  getCartByUserId,
  updateCartStatus,
};
