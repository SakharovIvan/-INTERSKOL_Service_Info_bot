const { Pool } = require("pg");


const client = new Pool({
    user: "root",
    host: "192.168.0.74",
    database: "SpareParts_bd",
    password: "root",
    port: "5432",
  });
  
const findMatNoSP = async (matNoSp) =>{
    try{
        let result = await client.query(`SELECT * FROM sparepartmas WHERE sp = '${matNoSp}';`)
        return result.rows[0]
    }catch(err){
console.log(err)
    }

     

    }

module.exports  = findMatNoSP
