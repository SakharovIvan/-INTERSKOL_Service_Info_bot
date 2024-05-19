const fs = require("fs");
const util = require("util");
const {client}=require('../db.js')

const pathSP_warehouse='./data/pathSP_warehouse.txt'
const RE_EOL = /\r?\n/;
const TAB = /\t/;

const updateSQL = (table, value, sp,date) =>{
    return `UPDATE ${table} SET warehouse = '${value}' warehousedateupdate = '${date}'  WHERE sp = '${sp}';`
}

const warehouseDataAddtoSQL = async()=>{
    const readFile = util.promisify(fs.readFile);
    try{
    const fileData = await readFile(pathSP_warehouse, "utf-8");
    const masData = await fileData.split(RE_EOL);
    const currentdate = new Date()
    const curdate = `${currentdate.getFullYear()}-${currentdate.getMonth()+1}-${currentdate.getDate()}`
    await client.connect()
    for (let spwarestatus of masData){
        const spwarestatusrow = await spwarestatus.split(TAB)
        console.log(updateSQL("sparepartmas",spwarestatusrow[1],spwarestatusrow[0]))
        await client.query(updateSQL("sparepartmas",spwarestatusrow[1],spwarestatusrow[0],curdate))
    }
}catch(err){
    console.log(err)
}finally{
    await client.end()
}
}

module.exports= {warehouseDataAddtoSQL}