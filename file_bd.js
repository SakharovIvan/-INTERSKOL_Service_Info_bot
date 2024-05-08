//const fs = require('fs')
//const util = require('util') 

const cli = require('nodemon/lib/cli');
const {Client} = require('pg');


const client = new Client  ({
    user:'root',
    host:'192.168.0.74',
    database: 'SpareParts_bd',
    password: 'root',
    port:'5432',
})

const createTable = `
CREATE TABLE SparePartmas ( 
    id bigint GENERATED ALWAYS AS IDENTITY,
    sp VARCHAR(50),
    name VARCHAR(150),
    tools text
    );
`
const makeRow = (table, tableRow, row)=>{
const pgRow = `INSERT INTO ${table} (${tableRow}) VALUES ${row};`
return pgRow
}

const deleteTable = `DROP TABLE SparePartmas;`

//client.connect((err)=>{
//client.query(querry,(err,res)=>{
//    console.log(err?err.stack:res.rows[0])
//    client.end
//})
//})

const RE_EOL = /\r?\n/;
const TAB =/\t/

class SP  {
    constructor([tool,sp,name]){
        this.tool=[tool]
        this.sp =sp
        this.name=name
    }
    addTool(newtool) {
        this.tool.push(newtool)
    }
}


const makeFromFileSparePartArray = async ()=> {
const readFile = util.promisify(fs.readFile)
const fileData = await readFile('./SP-ToolsUTF-8.txt', 'utf-8')
const masData = fileData.split(RE_EOL)
const masSP=[]
const promises = masData.map((id)=>{
    let sp_info = new SP(id.split(TAB))
    masSP.forEach((id)=>{
        if (id.sp==sp_info.sp){
            id.addTool(sp_info.tool[0])
        }
    })
    masSP.push(sp_info)

})
await Promise.all(promises)
return masSP
}

const start = async()=>{
    const massp = await makeFromFileSparePartArray()
    console.log(massp[2])
    const table = 'SparePartmas'
    const tableRow = 'sp, name, tools'
    let row
    try{
    await client.query(deleteTable)
    await client.query(createTable)
    console.log('Old table deleted, new created')
}catch(err){
    console.log('Cant delete|create table',err)
}

for (let sp_info of massp){
    row = `${sp_info["sp"]}, ${sp_info["name"]}, ${sp_info["tools"]},`
    client.query(makeRow(table,tableRow,row))
}


}
start()