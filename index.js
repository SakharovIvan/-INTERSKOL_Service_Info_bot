const TelegramAPI = require('node-telegram-bot-api')
const token = '6898283747:AAFJIfz8RcsIvr0J8zY2G78cGnMbvbEjFAo'
const bot = new TelegramAPI(token,{polling:true})

bot.setMyCommands ([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Информация о клиенте'}
])

bot.on('message', async msg =>{
    const text = msg.text
    const chatID = msg.chat.id
    
    if (text === '/start'){
        return bot.sendMessage(chatID, `Добро пожаловать в телграм бот по информационной системе ИНТЕРСКОЛ`)
    }
    if (text === '/info'){
        return bot.sendMessage(chatID, `Ваше имя ${msg.chat.first_name} ${msg.chat.last_name}`)
    }

    return bot.sendMessage(chatID, 'I don\'t understand')
} )