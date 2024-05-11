//
//const { Pool } = require("pg");
//
//const client = new Pool({
//  user: "root",
//  host: "192.168.0.74",
//  database: "SpareParts_bd",
//  password: "root",
//  port: "5432",
//});

const pool = require('./log_bd.js')

//CREATE TABLE clientLog (
//id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//chatID BIGINT,
//cli TEXT,
//text TEXT
//);

const logADD = async(chatID, clie, text)=>{
try{
    await pool.query(`INSERT INTO clientlog (chatid, cli, text) VALUES (${chatID},'${clie}','${text}');`)
    console.log('Cli Log added')
}catch(err){console.log(err)}
        //await client.connect();
   
       // await client.end();
   // }catch(err){console.log(err)}

}

module.exports = logADD