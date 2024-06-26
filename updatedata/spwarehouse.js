const fs = require("fs");
const util = require("util");
const {pool}=require('../db.js')

const pathSP_warehouse='./data/pathSP_warehouse.txt'
const RE_EOL = /\r?\n/;
const TAB = /\t/;

const updateSQL = (table, value, sp, date) =>{
    return `UPDATE ${table} SET warehouse = '${value}' WHERE sp = '${sp}';
    UPDATE ${table} SET warehousedateupdate = '${date}' WHERE sp = '${sp}';`
}

const warehouseDataAddtoSQL = async()=>{
    const readFile = util.promisify(fs.readFile);
    const currentdate = new Date().toLocaleDateString()
    console.log(currentdate)
    try{
    const fileData = await readFile(pathSP_warehouse, "utf-8");
    const masData = await fileData.split(RE_EOL);

    for (let spwarestatus of masData){
        const spwarestatusrow = await spwarestatus.split(TAB)
        //console.log(updateSQL("sparepartmas",spwarestatusrow[1],spwarestatusrow[0],currentdate))
        await pool.query(updateSQL("sparepartmas",spwarestatusrow[1],spwarestatusrow[0],currentdate))
    }
    console.log('ready')
}catch(err){
    console.log(err)
}
}

module.exports= {warehouseDataAddtoSQL}