//const fs = require('fs')
//const util = require('util') 

const cli = require('nodemon/lib/cli');
const {Client} = require('pg');


const client = new Client  ({
    PGUSER:'root',
    PGHOST:'192.168.0.74',
    PGDATABASE: 'SpareParts_bd',
    PGPASSWORD: 'root',
    PGPORT:'5432',
})

const querry = `
CREATE TABLE SparePartmas ( 
    id bigint GENERATED ALWAYS AS IDENTITY,
    sp VARCHAR(50),
    name VARCHAR(150),
    tools text
    );
    INSERT INTO SparePartmas (sp,name,tools)
VALUES ('hello','im warking','qwerty');
SELECT * FROM SparePartmas;
`

client.connect((err)=>{
client.query(querry,(err,res)=>{
    console.log(err?err.stack:res.rows[0])
    client.end
})
})



//try {     
//    const res = await client.query(querry); 
//    console.log('Table is successfully created', res.rows[0]); 
//    } catch (err) { 
//    console.log(err); 
//    } finally { 
//    client.close(); 
//    } 




//
//const createTable = async()=>{
//    try { 
//        await client.query(query); 
//        return console.log('Table is successfully created'); 
//        } catch (err) { 
//        console.log(err); 
//        } finally { 
//        client.close(); 
//        } 
//}
//
//const RE_EOL = /\r?\n/;
//const TAB =/\t/
//class SP  {
//    constructor([tool,sp,name]){
//        this.tool=[tool]
//        this.sp =sp
//        this.name=name
//    }
//    addTool(newtool) {
//        this.tool.push(newtool)
//    }
//}
//
//
//const makeFromFileBD = async ()=> {
//const readFile = util.promisify(fs.readFile)
//const fileData = await readFile('./SP-ToolsUTF-8.txt', 'utf-8')
//const masData = fileData.split(RE_EOL)
//const masSP=[]
//const promises = masData.map((id)=>{
//    let sp_info = new SP(id.split(TAB))
//    masSP.forEach((id)=>{
//        if (id.sp==sp_info.sp){
//            id.addTool(sp_info.tool[0])
//        }
//    })
//    masSP.push(sp_info)
//
//})
//await Promise.all(promises)
//return masSP
//}
//
//