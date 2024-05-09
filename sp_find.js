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
  
const findMatNoSP =  (matNoSp)=>{
    const filterParam = `sp = '${matNoSp}'`
    const table = "sparepartmas";
     client.connect();

       const result = client.query(sqlFilter(table, filterParam),(err,data)=> {
        if (err) 
            throw new Error(err);
        console.log(data, err);
        client.end();  
    });
       return [result['sp'], result['tool'], result['name']]

}

console.log(findMatNoSP('00.02.04.04.01'))

module.exports  = findMatNoSP
