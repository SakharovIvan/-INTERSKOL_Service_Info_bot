
const { Pool } = require("pg");


const sqlFilter =(table, param) => `SELECT * FROM ${table} WHERE ${param};`

const client = new Pool({
    user: "root",
    host: "192.168.0.74",
    database: "SpareParts_bd",
    password: "root",
    port: "5432",
  });
  
const findMatNoSP = async (matNoSp) =>{
    const filterParam = `sp = '${matNoSp}'`
    const table = "sparepartmas";
    let result
//try{
//    const pool = await client.connect()
//    console.log('CLient connected')
//}catch(err){
//console.log('Проблема при подключении',err)
//}

    try{
        const pool = await client.connect()
        console.log('CLient connected')
        result = await client.query(sqlFilter(table, filterParam))
        console.log('Filtered table', result.rows[0])
        pool.end().then(()=>console.log('Client disconected'))
        //console.log(result)
    }catch(err){
console.log(err)
    }

     
return result.rows[0]
    }

module.exports  = findMatNoSP
