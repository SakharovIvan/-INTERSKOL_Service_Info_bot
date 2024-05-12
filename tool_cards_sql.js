const fsp = require("file-system");
const { Client } = require("pg");


//REGEX 
const WAY = /.+\/.+\(/;
const WAY2 = /.+\//;
const PDFREGEXP = /\)\.pdf/;
const CODEDEL = /\(.+/;
const ZoneIdentifierFile = "Zone.Identifier";

const client = new Client({
  user: "root",
  host: "192.168.0.74",
  database: "SpareParts_bd",
  password: "root",
  port: "5432",
});

const createTable = `
CREATE TABLE toolinfo ( 
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    toolcode INTEGER,
    toolname VARCHAR(150),
    toolschemedir VARCHAR(250)
    );
`;

const deleteTable = `DROP TABLE toolinfo;`;

const makeRow = (table, tableRow, row) => {
  const pgRow = `INSERT INTO ${table} (${tableRow}) VALUES (${row});`;
  return pgRow;
};

const toolCodeReplace = (path) => {
  return path.replace(WAY, "").replace(PDFREGEXP, "");
};

const toolNameReplace = (path) => {
  return path.replace(WAY2, "").replace(CODEDEL, "");
};


const dirFilesNames = async (enterPath) => {
  try{
  const stat = await fsp.stat(enterPath);
  if (stat.isFile()) {
    return filepaths.push(`${enterPath}`);
  }
  const dir = await fsp.readdir(enterPath);
  for (let el of dir) {
    await dirFilesNames(`${enterPath}/${el}`);
  }
  return;}catch(err){console.log(err)}
};

const create_file_array = async () => {
  const toolsPath = "./tool_cards";
  let = filepaths = [];
  await dirFilesNames(toolsPath);
  return filepaths;
};


const write_files_to_SQL = async () => {
  try {
    const filesArray = await create_file_array();
    console.log(filesArray)
    await client.connect();
   // await client.query(deleteTable);
    await client.query(createTable);
    const newmas = [];
    for (let file of filesArray) {
      if (file.includes(ZoneIdentifierFile)) {
        continue;
      }
      let toolcode = toolCodeReplace(file);
      let toolname = toolNameReplace(file);
      newmas.push([toolcode, toolname, file]);
      await client.query(
        makeRow(
          "toolinfo",
          "toolcode, toolname, toolschemedir",
          `${toolcode},'${toolname}','${file}'`
        )
      );
    }
  } catch (err) {
    console.log(err);
  } finally {
    client.end();
  }
};

try {
  write_files_to_SQL().then("Tool Schem SQL Base was created");
} catch (err) {
  console.log(err);
}

const toolFilter = async (tool) => {
  try {
    let result = await client.query(
      `SELECT * FROM sparepartmas WHERE toolcode = '${tool}' OR toolname LIKE '${tool}';`
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
};

module.exports = toolFilter;