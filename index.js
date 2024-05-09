const TelegramAPI = require('node-telegram-bot-api')
const token = '6898283747:AAFJIfz8RcsIvr0J8zY2G78cGnMbvbEjFAo'
const bot = new TelegramAPI(token,{polling:true})
const findMatNoSP = require ('./sp_find')

const spCheck = async()=>{
    bot.on('message', async msg=>{
        const text = msg.text
        const chatID = msg.chat.id
        const info = await findMatNoSP(text)
        const spToolsInfo = info['tools'].replace(',','\n')
        const spMessage = `${info['sp']}\n${info['name']}\nСписок инструментов:\n${spToolsInfo} `
        console.log(info['tools'])
        bot.sendMessage(chatID, `Найдена следующая информация\n ${spMessage}`)
        return 
    })
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

    if (text === '/start'){
        return bot.sendMessage(chatID, `Добро пожаловать в телграм бот по информационной системе ИНТЕРСКОЛ`)
    }
    if (text === '/info'){
        return bot.sendMessage(chatID, `Ваше имя ${msg.chat.first_name} ${msg.chat.last_name} ${user.msg}`)
    }
    if (text === '/sp_info'){
        bot.sendMessage(chatID, `Ведите артикул запчасти`)
        return spCheck()
    }

    return bot.sendMessage(chatID, `Я тебя не понимаю`)
} )




