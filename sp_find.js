
const { Client } = require("pg");


const sqlFilter =(table, param) => `SELECT * FROM ${table} WHERE ${param};`

const client = new Client({
    user: "root",
    host: "192.168.0.74",
    database: "SpareParts_bd",
    password: "root",
    port: "5432",
  });
  
const findMatNoSP = async (matNoSp) =>{
    const filterParam = `sp = '${matNoSp}'`
    const table = "sparepartmas";
    try {
        client.connect();
        console.log('CLient connected')
    }catch(err){
        console.log('CLient didnt connected',err)
    }

try {
const result = await client.query(sqlFilter(table, filterParam))
await client.close()
console.log(result.rows[0])
return result.rows[0]
}catch (err){
    console.log (err)}
}


module.exports  = findMatNoSP
