const { Pool } = require("pg");
const { Client } = require("pg");
const token = '6898283747:AAFJIfz8RcsIvr0J8zY2G78cGnMbvbEjFAo'

const pool = new Pool({
  user: "root",
  host: "192.168.0.74",
  database: "SpareParts_bd",
  password: "root",
  port: "5432",
});

const client = new Client({
    user: "root",
    host: "192.168.0.74",
    database: "SpareParts_bd",
    password: "root",
    port: "5432",
  });
  

module.exports = {pool, client,token}