const { Pool } = require("pg");


const client = new Pool({
    user: "root",
    host: "192.168.0.74",
    database: "SpareParts_bd",
    password: "root",
    port: "5432",
  });
  
    const toolFilter = async (tool) => {
  //    if(parseInt(tool)===NaN){
  //      try {
  //        let result = await client.query(
  //          `SELECT * FROM toolinfo WHERE toolname SIMILAR TO '%${tool}%' LIMIT 7;`// OR toolname SIMILAR TO '%${tool}%'
  //        );
  //        //console.log(result.rows)
  //        return result.rows;
  //      } catch (err) {
  //        console.log(err);
  //      }
    //  }
        try {
          let result = await client.query(
            `SELECT * FROM toolinfo WHERE toolcode = ${tool} LIMIT 7;`// OR toolname SIMILAR TO '%${tool}%'
          );
          //console.log(result.rows)
          return result.rows;
        } catch (err) {
          console.log(err);
        }
      };
      
      module.exports = toolFilter;