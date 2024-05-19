const fs = require('fs')
const https = require('https')

const toolspcardsupload=async(thumbPath, path)=>{

 //  bot.on("message", async (thumbPath) => 
 // const thumbPath = await bot.getFileLink(msg.document.file_id);
 // }
 //)

        try{
            await fs.unlink(path)
        const file = await fs.createWriteStream(path,'utf8')
        await https.get(thumbPath, function(response) {
            response.pipe(file);
            file.on('finish', ()=>{
                file.close()
            })
        }
        )
    console.log('file_created')
    }catch(err){
        console.log(err)}

}

module.exports = {toolspcardsupload}