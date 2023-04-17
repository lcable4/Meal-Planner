const client = require("./index");
const bcrypt = require("bcrypt");
async function createAdmin({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  password = hashedPassword;
  try {
    await client.connect();
    const {
      rows: [user],
    } = await client.query(
      `
            INSERT INTO admins(username, password)
            VALUES($1, $2)
            RETURNING id, username;
        `,
      [username, password]
    );
    await client.release();
    return user;
  } catch (e) {
    throw e;
  }
}

async function getAdmin({ username, password }) {
  await client.connect();
  const {
    rows: [user],
  } = await client.query(
    `
        SELECT * FROM admins
        WHERE username=$1;
    `,
    [username]
  );
  await client.release();

  let isValid;
  console.log(user);
  if (user.password) {
    isValid = await bcrypt.compare(password, user.password);
  }
  if (isValid) {
    delete user.password;
    return user;
  }
}

module.exports = {
  createAdmin,
  getAdmin,
};
