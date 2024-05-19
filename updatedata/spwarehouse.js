const fs = require("fs");
const util = require("util");
const {client}=require('../db.js')

const pathSP_warehouse='./data/pathSP_warehouse.txt'
const RE_EOL = /\r?\n/;
const TAB = /\t/;

const updateSQL = (table, value, sp) =>{
    return `UPDATE ${table} SET warehouse = '${value}' warehousedateupdate = CURRENT_DATE  WHERE sp = '${sp}'`
}

const warehouseDataAddtoSQL = async()=>{
    const readFile = util.promisify(fs.readFile);
    try{
    const fileData = await readFile(pathSP_warehouse, "utf-8");
    const masData = fileData.split(RE_EOL);
   await client.connect()
    for (let spwarestatus of masData){
        const spwarestatusrow = spwarestatus.split(TAB)
        await client.query(updateSQL("sparepartmas",spwarestatusrow[1],spwarestatusrow[0] ))
    }
}catch(err){
    console.log(err)
}finally{
    await client.end()
}
}

module.exports= {warehouseDataAddtoSQL}