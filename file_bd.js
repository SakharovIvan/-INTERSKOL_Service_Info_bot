const fs = require('fs')
const SparePartModel = require('./SPmodel');
const util = require('util') 
const sequelize = require('./SpareParts_bd');

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


const makeFromFileBD = async ()=>{
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

const start = async () =>{
    try {
        const massp = await makeFromFileBD()
    }    catch (e){
        console.log('massp problem', e)
    }
    
    const massp = await makeFromFileBD()
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('Good BD connecton')
    }
    catch (e){
        console.log('No BD connecton', e)
    }
    
    for (let mas_sp_info of massp){
    let sp = mas_sp_info[sp]
        let tools = mas_sp_info[tool]
        let name = mas_sp_info[name]
        await SparePartModel.create(sp,name,tools);
    }

}

start()