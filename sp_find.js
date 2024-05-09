const { Client } = require("pg");
//const findMatNoSP = require('./file_bd.js')


const sqlFilter =(table, param) => `SELECT * FROM ${table} WHERE ${param}`

const client = new Client({
    user: "root",
    host: "192.168.0.74",
    database: "SpareParts_bd",
    password: "root",
    port: "5432",
  });
  
const findMatNoSP = async (matNoSp)=>{
    const filterParam = `sp = '${matNoSp}'`
    const table = "sparepartmas";
    await client.connect();
    try{
       const result = await client.query(sqlFilter(table, filterParam))
       return [result.sp, result.tool, result.name]
    } catch (err){
        return console.log(err)
    }
    
}
findMatNoSP('00.02.04.04.01',(err,data)=>{
    try {
        console.log(data)
    } catch (err){
        console.log(err)
    }
}
    ) 
module.exports  = findMatNoSP
