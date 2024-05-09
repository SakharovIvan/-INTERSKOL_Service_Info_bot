const fs = require("fs");
const util = require("util");
const { Client } = require("pg");

const client = new Client({
  user: "root",
  host: "192.168.0.74",
  database: "SpareParts_bd",
  password: "root",
  port: "5432",
});

const createTable = `
CREATE TABLE sparepartmas ( 
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sp VARCHAR(50),
    name VARCHAR(150),
    tools text
    );
`;
const makeRow = (table, tableRow, row) => {
  const pgRow = `INSERT INTO ${table} (${tableRow}) VALUES (${row});`;
  return pgRow;
};

const deleteTable = `DROP TABLE sparepartmas;`;

const RE_EOL = /\r?\n/;
const TAB = /\t/;

class SP {
  constructor([tool, sp, name]) {
    this.tool = [tool];
    this.sp = sp;
    this.name = name;
  }
  addTool(newtool) {
    this.tool.push(newtool);
  }
}

const makeFromFileSparePartArray = async () => {
  const readFile = util.promisify(fs.readFile);
  const fileData = await readFile("./SP-ToolsUTF-8.txt", "utf-8");
  const masData = fileData.split(RE_EOL);
  const masSP = [];
  const promises = masData.map((id) => {
    let sp_info = new SP(id.split(TAB));
    masSP.forEach((id) => {
      if (id.sp == sp_info.sp) {
        id.addTool(sp_info.tool[0]);
      }
    });
    masSP.push(sp_info);
  });
  await Promise.all(promises);
  return masSP;
};

const start = async () => {
  const massp = await makeFromFileSparePartArray();
  console.log(massp[2]);
  const table = "sparepartmas";
  const tableRow = "sp, name, tools";
  let row;
  await client.connect();
  try {
    await client.query(deleteTable);
    await client.query(createTable);
  } catch (err) {
    console.log(err);
  } finally {
    for (let sp_info of massp) {
      //console.log(sp_info)
      row = `'${sp_info["sp"]}', '${sp_info["name"]}', '${sp_info["tool"]}'`;
      //console.log(row)
      try {
        await client.query(makeRow(table, tableRow, row));
      } catch (err) {
        console.log(err);
      }
    }
    await client.end();
  }
};

start();

const sqlFilter =(table, param) => `SELECT * FROM ${table} WHERE ${param}`

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
module.exports  = findMatNoSP