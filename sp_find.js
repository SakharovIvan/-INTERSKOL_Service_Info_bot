const { pool } = require("./db.js");



  
const findMatNoSP = async (matNoSp) =>{
    try{
        let result = await pool.query(`SELECT * FROM sparepartmas WHERE sp = '${matNoSp}';`)
        return result.rows[0]
    }catch(err){
console.log(err)
    }
    }

module.exports  = findMatNoSP
