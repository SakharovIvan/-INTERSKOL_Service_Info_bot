const fs = require("fs");
const util = require("util");
const { client } = require("../db.js");

const createTable = `
CREATE TABLE sparepartmas ( 
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sp VARCHAR(150),
    name VARCHAR(150),
    tools text,
    characteristics text,
    warehouse text,
    warehousedateupdate text
    );
`;

const createTableSPAnalog = `
CREATE TABLE sparepartanalog ( 
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sp VARCHAR(150),
    analog VARCHAR(150)
    );
    `;
    const deleteTableSPAnalog = `DROP TABLE sparepartanalog;`;
const makeRow = (table, tableRow, row) => {
  const pgRow = `INSERT INTO ${table} (${tableRow}) VALUES (${row});`;
  return pgRow;
};

const deleteTable = `DROP TABLE sparepartmas;`;

const RE_EOL = /\r?\n/;
const TAB = /\t/;

class SP {
  constructor([sp, name, tool, characteristics]) {
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
    let check = false;
    masSP.forEach((id) => {
      if (id.sp == sp_info.sp) {
        id.addTool(sp_info.tool[0]);
        check = true;
      }
    });
    if (check !== true) {
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
    console.log("Old Table deleted, new created");
    for (let sp_info of massp) {
      row = `'${sp_info["sp"]}', '${sp_info["name"]}', '${sp_info["tool"]}', '${sp_info["characteristics"]}'`;
      try {
        await client.query(makeRow(table, tableRow, row));
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    await client.end();
  }
};
try {
  update_sp_data().then(() => {
    console.log("ready");
  });
} catch (error) {
  console.log(error);
}

const update_sp_analog = async () => {
  const readFile = util.promisify(fs.readFile);
  const fileData = await readFile("./data/analog_SP.txt", "utf-8");
  const masData = fileData.split(RE_EOL);
  const masSP = [];
  try {
    await client.query(deleteTableSPAnalog);
    await client.query(createTableSPAnalog);
    const promises = masData.map(async(id) => {
      const spananlog = id.split(TAB)
      await client.query(makeRow('sparepartanalog',"sp, analog", `'${spananlog[0]}', '${spananlog[1]}'`))
      
    });
    await Promise.all(promises);

  } catch (error) {
    console.log(error)
  }

};

module.exports = { update_sp_data , update_sp_analog};
