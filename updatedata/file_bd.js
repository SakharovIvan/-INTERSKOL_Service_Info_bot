const fs = require("fs");
const util = require("util");
const {client}=require('../db.js')


const createTable = `
CREATE TABLE sparepartmas ( 
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sp VARCHAR(50),
    name VARCHAR(150),
    tools text,
    characteristics text,
    warehouse text,
    warehousedateupdate date
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
  constructor([tool, sp, name,characteristics]) {
    this.tool = [tool];
    this.sp = sp;
    this.name = name;
    this.characteristics = characteristics;
  }
  addTool(newtool) {
    this.tool.push(newtool);
  }
}

const makeFromFileSparePartArray = async () => {
  const readFile = util.promisify(fs.readFile);
  const fileData = await readFile("./data/pathSP_tools.txt", "utf-8");
  const masData = fileData.split(RE_EOL);
  const masSP = [];
  const promises = masData.map((id) => {
    let sp_info = new SP(id.split(TAB));
    let check = false
    masSP.forEach((id) => {
      if (id.sp == sp_info.sp) {
        id.addTool(sp_info.tool[0]);
       check =true
      }
    });
    if (check !== true ){
     masSP.push(sp_info);  
    }
  });
  await Promise.all(promises);

  return masSP;
};

const update_sp_data = async () => {
  const massp = await makeFromFileSparePartArray();
  const table = "sparepartmas";
  const tableRow = "sp, name, tools, characteristics";
  let row;
  await client.connect();
  try {
    await client.query(deleteTable);
    await client.query(createTable);
    console.log('Old Table deleted, new created')
  } catch (err) {
    console.log(err);
  } finally {
    for (let sp_info of massp) {
      row = `'${sp_info["sp"]}', '${sp_info["name"]}', '${sp_info["tool"]}', '${sp_info["characteristics"]}'`;
      try {
        await client.query(makeRow(table, tableRow, row));
      } catch (err) {
        console.log(err);
      }
    }
    await client.end();
  }
};

module.exports = {update_sp_data}

