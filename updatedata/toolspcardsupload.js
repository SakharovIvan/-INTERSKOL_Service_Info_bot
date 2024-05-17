const fs = require('fs')
const https = require('https')

const start=async(thumbPath, path)=>{

 //  bot.on("message", async (thumbPath) => 
 // const thumbPath = await bot.getFileLink(msg.document.file_id);
 // }
 //)

        try{
        const file = await fs.createWriteStream(path)
        await https.get(thumbPath, function(response) {
            response.pipe(file);
            file.on('finish', ()=>{
                file.close()
            })
        }
        )
    }catch(err){
        console.log(err)}

}

module.exports = {start}