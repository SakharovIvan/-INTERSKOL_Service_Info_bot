const { Pool } = require("pg");


const client = new Pool({
    user: "root",
    host: "192.168.0.74",
    database: "SpareParts_bd",
    password: "root",
    port: "5432",
  });
  
    const toolFilter = async (tool) => {
        try {
          if(parseInt(tool)===Nan){
          let result = await client.query(
            `SELECT * FROM toolinfo WHERE toolc toolname SIMILAR TO '%${tool}%' LIMIT 7;`
          );

          return result.rows;}else{
            let result = await client.query(
              `SELECT * FROM toolinfo WHERE toolcode = ${tool} LIMIT 7;`
            );
  
            return result.rows
          }
        } catch (err) {
          console.log(err);
        }
      };
      
      module.exports = toolFilter;