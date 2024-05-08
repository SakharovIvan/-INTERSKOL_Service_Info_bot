const TelegramAPI = require('node-telegram-bot-api')
const token = '6898283747:AAFJIfz8RcsIvr0J8zY2G78cGnMbvbEjFAo'
const bot = new TelegramAPI(token,{polling:true})
const sequelize = require('./bd')
const UserModel = require('./models')
//const SparePartModel = require('./SPmodel');
const findSP = require('./file_bd')

const spCheck = async()=>{
    bot.on('message', async msg=>{
        await bot.sendMessage(chatID, `Введите информацию о инструменте`)
        const text = msg.text
        return bot.sendMessage(chatID, `Найдена следующая информация ${findSP(text)}`)
           
    })

    
}

const start = async ()=>{
try {
    await sequelize.authenticate()
    await sequelize.sync()
}
catch (e){
    console.log('No BD connecton', e)
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
        await UserModel.create({chatID})
    }catch(e){
        return bot.sendMessage(chatID,'Something going wrong with creating chatId model', e)
    }
    const user = await UserModel.findOne({chatID})
    user.msg = text
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

    return bot.sendMessage(chatID, `Найдена следующая информация ${await findSP(text)}`)
} )

}

start()
