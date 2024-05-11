const TelegramAPI = require('node-telegram-bot-api')
const token = '6898283747:AAFJIfz8RcsIvr0J8zY2G78cGnMbvbEjFAo'
const bot = new TelegramAPI(token,{polling:true})
const findMatNoSP = require ('./sp_find')

const replaceAll=(str, find, replace)=>{
    return str.replace(new RegExp(find, 'g'), replace);
  }

const spCheck = async()=>{
    bot.on('message', async msg=>{
        const text = msg.text
        const chatID = msg.chat.id
        try{
        const info = await findMatNoSP(text)
        //if (info===undefined){return await bot.sendMessage(chatID, `Информация по артикулу не найден`)}
        const spToolsInfo = replaceAll(info['tools'],',','\n')
        const spMessage = `${info['sp']}\n${info['name']}\nСписок инструментов:\n${spToolsInfo} `
        await bot.sendMessage(chatID, `Найдена следующая информация\n ${spMessage}`)
    }catch(err){
        console.log(err)
    }
    console.log('Вышлти из ботон спчек')
        return 
    })
return await bot.sendMessage(chatID, `Для поиска другого артикула, введите команду \`/sp_info\``)
}


bot.setMyCommands ([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Информация о клиенте'},
    {command: '/tool_info', description: 'Информация об инструменте'},
    {command: '/sp_info', description: 'Поиск инструмента по запчасти'}
])

bot.on('message', async msg =>{
    const text = msg.text
    const chatID = msg.chat.id
    try{
    if (text === '/start'){
        await bot.sendPhoto(chatID, './INTERSKOL_logo.jpg')
        await bot.sendMessage(chatID, `Добро пожаловать в телграм бот по информационной системе ИНТЕРСКОЛ`)
        return
    }
    if (text === '/info'){
        return bot.sendMessage(chatID, `Для поиска применимости запчасти введите команду \`/sp_info\` и введите артикул ЗЧ\n
        Для поиска вхем инструмента введите команду \`/tool_info\` и введите код инструмента - первые числа до точки в серийном номере нструмента или артикула с коробки инструмента`)
    }
    if (text === '/sp_info'){
        await bot.sendMessage(chatID, `Ведите артикул запчасти`)
        await spCheck()
        return 
    }
}catch(err){ console.log(err)}

    return bot.sendMessage(chatID, `Я тебя не понимаю`)
} )




