
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
    let result

    try{
        await client.connect()
        console.log('CLient connected')
        result = await client.query(sqlFilter(table, filterParam))
        console.log(result)
    }catch(err){
console.log(err)
    }finally{
        client.end()
        .then(()=>console.log('отключились от сервера'))
    }
//        client.connect()
//        .then(()=>console.log('CLient connected'))
//        .then(()=>{result = client.query(sqlFilter(table, filterParam))})
//        .catch(err=>console.log('CLient didnt connected',err))
//        .finally(()=>client.end())
//        console.log(result)
return result.rows[0]
    }



module.exports  = findMatNoSP
