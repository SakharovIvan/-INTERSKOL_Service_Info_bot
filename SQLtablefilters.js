const { pool } = require("./db.js");

const toolFilter = async (tool) => {
 // const newTool = Number(tool)
 // const typeoftool = typeof newTool;
  if (Number(tool).toString() !== "NaN") {
    try {
      let result = await pool.query(
        `SELECT * FROM toolinfo WHERE toolcode = ${tool} LIMIT 7 ;`
      );
      return result.rows;
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      let result = await pool.query(
        `SELECT * FROM toolinfo WHERE toolname ILIKE '%${tool}%' LIMIT 7 ;`
      );
      return result.rows;
    } catch (err) {
      console.log(err);
    }
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

const findSPbyChar = async (char) => {
  try {
    let result = await pool.query(
      `SELECT * FROM sparepartmas WHERE characteristics ILIKE '%${char}%' OR name ILIKE '%${char}%';`
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
};
const findSPanalog = async (text)=>{
  try {
    let result = await pool.query(
      `SELECT * FROM sparepartanalog WHERE sp ='${text}';`
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

module.exports = { toolFilter, findMatNoSP, findSPbyChar,findSPanalog };
