
const { Pool } = require("pg");


const sqlFilter =(table, param) => `SELECT * FROM ${table} WHERE ${param};`

const client = new Pool({
    user: "root",
    host: "192.168.0.74",
    database: "SpareParts_bd",
    password: "root",
    port: "5432",
    connectionTimeoutMillis: 2000,
  });
  
const findMatNoSP = async (matNoSp) =>{
    const filterParam = `sp = '${matNoSp}'`
    const table = "sparepartmas";
    let result
try{
    await client.connect()
    console.log('CLient connected')
}catch(err){
console.log('Проблема при подключении',err)
}

    try{
        
        result = await client.query(sqlFilter(table, filterParam))
        console.log(result)
    }catch(err){
console.log(err)
    }finally{
        await client.end()
        //.then(()=>console.log('отключились от сервера'))
    }
//        client.connect()
//        .then(()=>console.log('CLient connected'))
//        .then(()=>{result = client.query(sqlFilter(table, filterParam))})
//        .catch(err=>console.log('CLient didnt connected',err))
//        .finally(()=>client.end())
//        console.log(result)
return result.rows[0]
    }


findMatNoSP('51.04.02.01.00').then(console.log)
module.exports  = findMatNoSP
