const fsp = require("file-system");
const { Client } = require("pg");
const util = require("util");

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
    toolname TEXT,
    toolschemedir TEXT
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

const reafspstat  = util.promisify(fsp.stat);
const fspreadDir = util.promisify(fsp.readdir)

const dirFilesNames = async (enterPath) => {

  const stat = await reafspstat(enterPath);
  if (stat.isFile()) {
    //console.log(enterPath)
    return filepaths.push(`${enterPath}`);
  }
  const dir = await fspreadDir(enterPath);
  for (let el of dir) {
    await dirFilesNames(`${enterPath}/${el}`);
  }
  return;
};


const write_files_to_SQL = async () => {
  const toolsPath = "./tool_cards";
  let = filepaths = [];
try{
  await dirFilesNames(toolsPath) ;}catch (err) {
    console.log(err);
  } 
  
  try {
    await client.connect();
    await client.query(deleteTable);
    await client.query(createTable);
   // const newmas = [];
    for (let file of filepaths) {
      if (file.includes(ZoneIdentifierFile)) {
        continue;
      }
      let toolcode = toolCodeReplace(file);
      let toolname = toolNameReplace(file);
      //console.log(makeRow("toolinfo","toolcode, toolname, toolschemedir",`${toolcode},'${toolname}','${file}'`))
      //newmas.push([toolcode, toolname, file]);
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

module.exports= write_files_to_SQL

