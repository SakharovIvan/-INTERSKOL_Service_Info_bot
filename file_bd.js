const fs = require('fs')
const util = require('util') 
const Client = require('pg');
//const { database, password } = require('pg/lib/defaults');

const db = new Client  ({
    user:'root',
    host:'192.168.0.74',
    database: 'SpareParts_bd',
    password: 'root',
    port:'5432'
})

const query = `
CREATE TABLE SparePart ( 
    id bigint GENERATED ALWAYS AS IDENTITY,
    sp VARCHAR(50),
    name VARCHAR(150),
    tools text
    );
`

const createTable = async()=>{
    try { 
        await db.query(query); 
        return console.log('Table is successfully created'); 
        } catch (err) { 
        console.log(err.stack); 
        } finally { 
        db.close(); 
        } 
}

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


const makeFromFileBD = async ()=> {
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

try {
    createTable()
}catch(e){
    console.log(e)
}
