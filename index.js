const TelegramAPI = require('node-telegram-bot-api')
const token = '6898283747:AAFJIfz8RcsIvr0J8zY2G78cGnMbvbEjFAo'
const bot = new TelegramAPI(token,{polling:true})
const findMatNoSP = require ('./sp_find')
const logADD = require('./log/log_add.js')
const toolFilter = require('./tool_cards_sql.js')

const replaceAll=(str, find, replace)=>{
    return str.replace(new RegExp(find, 'g'), replace);
  }

  
const spCheck = async(chatID, text)=>{

 try{
    const info = await findMatNoSP(text)
    const spToolsInfo = await replaceAll(info['tools'],',','\n')
    const spMessage = await `${info['sp']}\n${info['name']}\nСписок инструментов:\n${spToolsInfo}`

    return bot.sendMessage(chatID,`ВОт что нашел:\n${spMessage}`)
 }catch(err){
    console.log('ПРоблема с спЧек ',err)
 }
 
 try{
  const info = await toolFilter(text)
  const spToolsInfo = await replaceAll(info['tools'],',','\n')
  const spMessage = await `${info['sp']}\n${info['name']}\nСписок инструментов:\n${spToolsInfo}`

  return bot.sendMessage(chatID,`ВОт что нашел:\n${spMessage}`)
}catch(err){
  console.log('ПРоблема с спЧек ',err)
}
return bot.sendMessage(chatID,`Такого я не нашел(((`)
}

const start = async () => {
    console.log('start start')
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Информация о клиенте" },
    // {command: '/tool_info', description: 'Информация об инструменте'},
    //{ command: "/sp_info", description: "Поиск инструмента по запчасти" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatID = msg.chat.id;
    const username = msg.from.username
    const time = msg.date
    //console.log(username)
    
    try {
      logADD(chatID,username,text,time)
      if (text === "/start") {
        await bot.sendPhoto(chatID, "./INTERSKOL_logo.jpg");
        await bot.sendMessage(
          chatID,
          `Добро пожаловать в телграм бот по информационной системе ИНТЕРСКОЛ`
        );
        return;
      }
      if (text === "/info") {
        return bot.sendMessage(
          chatID,
          `Для поиска применимости запчасти введите артикул ЗЧ\n
        Для поиска схем инструмента введите код инструмента - первые числа до точки в серийном номере нструмента или артикула с коробки инструмента`
        );
      }

      return spCheck(chatID,text)
    } catch (err) {
      console.log('проблема с обработкой сообщения',err,msg);
    }
  }
);

return console.log('start end')
};

start()

