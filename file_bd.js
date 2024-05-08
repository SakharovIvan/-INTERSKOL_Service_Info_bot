const fs = require('fs')
const SparePart = require('./SPmodel');
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

    const massp = await makeFromFileBD()

    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('Good BD connecton')
    }
    catch (e){
        console.log('No BD connecton', e)
    }

    console.log(massp[8])
    
    massp.map(async (mas_sp_info)=>{
        let spmas = mas_sp_info['sp']
        let toolsmas = mas_sp_info['tool']
        let namemas = mas_sp_info['name']
        try {
            await SparePart.create({sp:spmas,name:namemas,tools:toolsmas})
        }catch(e){
        console.log(`зч не записана в бд ${spmas}`,e)
        }       
    })

}

start()