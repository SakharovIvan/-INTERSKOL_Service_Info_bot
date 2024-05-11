
const client = require('./log_bd.js')

//CREATE TABLE clientLog (
//id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//chatID BIGINT,
//cli TEXT,
//text TEXT
//);

const logADD = async(chatID, cli, text)=>{
await client.query(`INSERT INTO clientLog (chatID, cli, text) VALUES (${chatID},${cli},${text});`)
}

module.exports = logADD