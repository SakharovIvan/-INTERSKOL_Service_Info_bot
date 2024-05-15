const {pool} = require('./log_bd.js')

const logADD = async(chatID, clie, text, time)=>{
try{
    await pool.query(`INSERT INTO clientlog (chatid, cli, text,time) VALUES (${chatID},'${clie}','${text}',${time} );`)
    console.log('Cli Log added')
}catch(err){console.log(err)}
}

module.exports = logADD