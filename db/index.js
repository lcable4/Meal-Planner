const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  // create the pool object
  connectionString:
    process.env.DATABASE_URL || "postgres://localhost/mealPlanner",

  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,

  max: 20,
  idleTimeoutMillis: 300000,
  connectionTimeoutMillis: 10000,
});

class Client {
  constructor() {
    this.pool = pool;
  }

  async connect() {
    // use this before you query the db
    try {
      this.client = await pool.connect();
    } catch (e) {
      throw e;
    }
  }

  async query(sql, params) {
    let client;
    try {
      client = await this.pool.connect();
      const result = await client.query(sql, params);
      return result;
    } catch (e) {
      throw e;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async release() {
    //release the connection back to the pool
    try {
      await this.client.release();
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new Client();
