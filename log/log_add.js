
const client = require('./log_bd.js')

//CREATE TABLE clientLog (
//id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//chatID BIGINT,
//cli TEXT,
//text TEXT
//);

const logADD = async(chatID, cli, text)=>{
    try{
      //  await client.connect();
        await client.query(`INSERT INTO clientLog (chatID, cli, text) VALUES (${chatID},${cli},${text});`)
        console.log('Cli Log added')
       // await client.end();
    }catch(err){console.log(err)}

}
logADD(1234,'Ivan','sometext')
module.exports = logADD