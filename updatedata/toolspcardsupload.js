const fs = require('fs')
const https = require('https')

const toolspcardsupload=async(thumbPath, path)=>{
        try{
        await fs.unlink(path,function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
        })
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