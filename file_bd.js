const fs = require('fs')
const util = require('util') 
//const {SparePart} = require('pg');
//const { database, password } = require('pg/lib/defaults');

//const db = new SparePart ({
//    user:'root',
//    host:'192.168.0.74',
//    database: 'SpareParts_bd',
//    password: 'root',
//    port:'5432'
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


const makeFromFileBD = async (findSP)=> {
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
const newMas = await Promise.all(promises)
return newMas.filter((datasp)=>datasp.sp===findSP)

}
//
//const start = async () =>{
//    const massp = await makeFromFileBD()
//
//    try {
//        await db.connect()
//        console.log('Good BD connecton')
//    }
//    catch (e){
//        console.log('No BD connecton', e)
//    }
//
//    console.log(massp[8])
//    let id=1
//    massp.map(async (mas_sp_info)=>{
//        let spmas = mas_sp_info['sp']
//        let toolsmas = mas_sp_info['tool']
//        let namemas = mas_sp_info['name']
//        let sparePartID 
//        try {
//            await SparePart.create({id})
//            sparePartID = await SparePart.findOne({id})
//            sparePartID.sp = spmas
//            sparePartID.tools = toolsmas
//            sparePartID.name = namemas
//            idm+=1
//        }catch(e){
//        console.log(`зч не записана в бд ${spmas}`,e)
//        }       
//    })
//return
//}
//
module.exports = makeFromFileBD