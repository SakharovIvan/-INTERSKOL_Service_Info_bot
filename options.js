module.exports ={
    uploadData:{
        reply_markup: JSON.stringify({
            keyboard: [
                {text:'Загрузить привязку зч к инструменту',callback_data:'SPtoTool'},
                {text:'Загрузить складские остатки',callback_data:'SPwarehouse'}
             //   {text:'',callback_data:''}
            ]
        })
    }
}