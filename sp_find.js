const { Client } = require("pg");
//const findMatNoSP = require('./file_bd.js')


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
       
const result = await client.query(sqlFilter(table, filterParam))//,(err,data)=> {
//           if (err) throw new Error(err);
//           client.end();
//           return data
//        });
//console.log([result['sp'], result['tool'], result['name']])
return result.rows[0]
}

//findMatNoSP('00.02.04.04.01')
//.then(console.log)
module.exports  = findMatNoSP
