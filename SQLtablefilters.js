const { pool } = require("./db.js");

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
    let result = await pool.query(
      `SELECT * FROM toolinfo WHERE toolcode = ${tool} LIMIT 7;` // OR toolname SIMILAR TO '%${tool}%'
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
};

const findMatNoSP = async (matNoSp) => {
  try {
    let result = await pool.query(
      `SELECT * FROM sparepartmas WHERE sp = '${matNoSp}';`
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

module.exports = { toolFilter, findMatNoSP };
