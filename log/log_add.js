
const { Pool } = require("pg");

const client = new Pool({
  user: "root",
  host: "192.168.0.74",
  database: "SpareParts_bd",
  password: "root",
  port: "5432",
});

//const client = require('./log_bd.js')

//CREATE TABLE clientLog (
//id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//chatID BIGINT,
//cli TEXT,
//text TEXT
//);

const logADD = (chatID, cli, text)=>{
try{
    client.query(`INSERT INTO clientlog (chatid, cli, text) VALUES (${chatID},${cli},${text});`)
    console.log('Cli Log added')
}catch{throw Error}
        //await client.connect();
   
       // await client.end();
   // }catch(err){console.log(err)}

}
logADD(1234,'Ivan','sometext')
module.exports = logADD