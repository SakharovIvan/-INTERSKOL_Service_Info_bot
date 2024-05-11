const { Pool } = require("pg");

const pool = new Pool({
  user: "root",
  host: "192.168.0.74",
  database: "SpareParts_bd",
  password: "root",
  port: "5432",
});

module.exports = pool